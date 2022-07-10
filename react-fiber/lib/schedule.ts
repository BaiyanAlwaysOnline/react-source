import { IFiber } from "./react-dom";
import {
  DELETION,
  ELEMENT_TEXT,
  PLACEMENT,
  TAG_CLASS,
  TAG_FUNCTION_COMPONENT,
  TAG_HOST,
  TAG_ROOT,
  TAG_TEXT,
  UPDATE,
} from "../src/constants";
import { Update, UpdateQueue } from "./update";

/**
 * 从根节点开始
 * 1. render 阶段
 *    功能：diff 对比新旧VDom，进行增量更新或者创建；
 *    特点：此阶段比较费时，要对整个任务进行拆分成若干小任务，此阶段可暂停，可恢复；
 *    产出：生成fiber树  + effect list  标记那些节点删除了，那些节点更新了
 * 2. commit 阶段
 *     进行DOM更新创建，此阶段不能暂停，一气呵成
 * @param fiber
 */

// 正在加工的fiber树，非渲染中的fiber树；
let workInProgressRoot: null | IFiber = null;
// 正在渲染中的fiber树；
let currentRoot: null | IFiber = null;
// 下一个要处理的工作单元（fiber）
let nextUnitOfWork: undefined | IFiber = undefined;
// 需要删除的节点集合
let deletions: IFiber[] = [];
// 正在工作中的fiber
let workInProgressFiber: null | IFiber = null;
let hookIndex = 0;

function scheduleRoot(rootFiber?: IFiber) {
  /**
   * 优化点：双缓存树，第三次更新开始，不再创建fiber树（频繁创建对象消耗性能），而是复用上上次的fiber树
   */
  if (currentRoot && currentRoot.alternate) {
    console.log("第二次之后的更新");
    workInProgressRoot = currentRoot.alternate; // 第一次渲染出来的那个fiber tree
    workInProgressRoot.alternate = currentRoot; // 让这个树的替身指向的当前的currentRoot
    if (rootFiber) workInProgressRoot.props = rootFiber.props; // 让它的props更新成新的props
  } else if (currentRoot) {
    console.log("非第一次渲染");
    if (rootFiber) {
      // 如果是setstate触发更新，没有rootFiber，直接用currentRoot
      rootFiber.alternate = currentRoot;
      workInProgressRoot = rootFiber;
    } else {
      workInProgressRoot = {
        ...currentRoot,
        alternate: currentRoot,
      };
    }
  } else {
    console.log("第一次渲染");
    workInProgressRoot = rootFiber;
  }

  workInProgressRoot.firstEffect =
    workInProgressRoot.lastEffect =
    workInProgressRoot.nextEffect =
      null;
  nextUnitOfWork = workInProgressRoot;
}

function workLoop(deadline: IdleDeadline) {
  let shouldYield = false;
  while (!shouldYield && nextUnitOfWork) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }
  if (!nextUnitOfWork && workInProgressRoot) {
    console.log("render阶段结束");
    // render阶段结束，开始commit阶段
    commitRoot();
  }
  // 1. 如果还有任务没有执行完，让出主线程给浏览器，下次浏览器空闲时执行；
  // 2. 如果没有任务了，继续监听是否有调度任务
  window.requestIdleCallback(workLoop, { timeout: 500 });
}

function commitRoot() {
  deletions.forEach(commitWork);
  let currentFiber = workInProgressRoot?.firstEffect; // effectLis副作用链表t的头节点；
  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  currentRoot = workInProgressRoot;
  workInProgressRoot = null;
  deletions.length = 0;
}

function commitWork(currentFiber: IFiber) {
  if (!currentFiber) return;
  let returnFiber = currentFiber.return;
  // returnFiber如果是一个类组件或者函数组件的话
  while (
    returnFiber.tag !== TAG_HOST &&
    returnFiber.tag !== TAG_ROOT &&
    returnFiber.tag !== TAG_TEXT
  ) {
    returnFiber = returnFiber.return;
  }
  let returnDom = returnFiber?.stateNode;
  // 新增
  if (currentFiber.effectTag === PLACEMENT) {
    let nextFiber = currentFiber;
    // 如果要挂载的节点不是DOM节点，比如说是类组件Fiber,一直找第一个儿子，直到找到一个真实DOM节点为止
    while (nextFiber.tag !== TAG_HOST && nextFiber.tag !== TAG_TEXT) {
      nextFiber = currentFiber.child;
    }
    returnDom?.appendChild(nextFiber.stateNode!);
  } else if (currentFiber.effectTag === DELETION) {
    return commitDeletion(currentFiber, returnDom);
  } else if (currentFiber.effectTag === UPDATE) {
    // @ts-ignore
    if (currentFiber.type === ELEMENT_TEXT) {
      // @ts-ignore
      if (currentFiber.alternate.props.text != currentFiber.props.text) {
        // @ts-ignore
        currentFiber.stateNode.textContent = currentFiber.props.text;
      }
    } else {
      updateDOM(
        currentFiber.stateNode,
        currentFiber.alternate.props,
        currentFiber.props
      );
    }
  }
  currentFiber.effectTag = null;
}

function commitDeletion(currentFiber, domReturn) {
  // 原生DOM直接删
  if (currentFiber.tag == TAG_HOST || currentFiber.tag == TAG_TEXT) {
    domReturn.removeChild(currentFiber.stateNode);
  } else {
    commitDeletion(currentFiber.child, domReturn);
  }
}

/**
 * 先递 beginWork
 *    1. 创建真实DOM
 *    2. 创建子fiber
 * 再归 completeUnitOfWork
 * @param currentFiber
 */
function performUnitOfWork(currentFiber: IFiber): IFiber | undefined {
  beginWork(currentFiber);
  if (currentFiber.child) {
    return currentFiber.child;
  }
  // 当没有儿子了，此工作单元完成
  while (currentFiber) {
    completeUnitOfWork(currentFiber);
    // 在找兄弟
    if (currentFiber.sibling) {
      return currentFiber.sibling;
    }
    // 它和它兄弟都完成了，父亲也完成
    currentFiber = currentFiber.return!;
  }
}

function beginWork(currentFiber: IFiber) {
  debugger;

  switch (currentFiber.tag) {
    case TAG_ROOT: // 根节点
      updateHostRoot(currentFiber);
      break;
    case TAG_CLASS: // 原生DOM节点
      updateClassComponent(currentFiber);
      break;
    case TAG_FUNCTION_COMPONENT: // 原生DOM节点
      updateFunctionalComponent(currentFiber);
      break;
    case TAG_TEXT: // 文本节点
      updateHostText(currentFiber);
      break;
    case TAG_HOST: // 原生DOM节点
      updateHost(currentFiber);
      break;
    default:
      break;
  }
}
/**
 * 收集有副作用的fiber，组成effect list
 * @param currentFiber
 */
function completeUnitOfWork(currentFiber: IFiber) {
  // 找到父节点
  let returnFiber = currentFiber.return;
  if (returnFiber) {
    // =>  把儿子的effect挂载到父亲上
    if (!returnFiber.firstEffect)
      returnFiber.firstEffect = currentFiber.firstEffect;
    if (currentFiber.lastEffect) {
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber.firstEffect;
      }
      returnFiber.lastEffect = currentFiber.lastEffect;
    }

    // =>  如果自己有effect，再把自己挂载到父亲上
    const effectTag = currentFiber.effectTag;
    // 如果有副作用
    if (effectTag) {
      // 建立单链表
      if (returnFiber.lastEffect) {
        returnFiber.lastEffect.nextEffect = currentFiber;
      } else {
        // 第一次建立
        returnFiber.firstEffect = currentFiber;
      }
      returnFiber.lastEffect = currentFiber;
    }
  }
}

function updateHostRoot(currentFiber: IFiber) {
  let newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}

function updateClassComponent(currentFiber: IFiber) {
  if (!currentFiber.stateNode) {
    // 类组件 stateNode 组件的实例
    currentFiber.stateNode = new currentFiber.type(currentFiber.props);
    // new ClassCounter(); 类组件实例   fiber双向指向
    currentFiber.stateNode.internalFiber = currentFiber;
    currentFiber.updateQueue = new UpdateQueue();
  }
  // 更新类组件的state
  currentFiber.stateNode.state = currentFiber.updateQueue.forceUpdate(
    currentFiber.stateNode.state
  );
  // 得到新的虚拟DOM
  let newElement = currentFiber.stateNode.render();
  const newChildren = [newElement];
  // diff
  reconcileChildren(currentFiber, newChildren);
}

function updateFunctionalComponent(currentFiber: IFiber) {
  // 渲染函数组件时，挂载当前fiber到workInProgressFiber上
  workInProgressFiber = currentFiber;
  workInProgressFiber.hooks = [];
  hookIndex = 0;
  const newChildren = [currentFiber?.type(currentFiber.props)];
  reconcileChildren(currentFiber, newChildren);
}

function updateHostText(currentFiber: IFiber) {
  // 说明还没创建真实DOM
  if (!currentFiber.stateNode) {
    currentFiber.stateNode = createDOM(currentFiber)!;
  }
}

function updateHost(currentFiber: IFiber) {
  if (!currentFiber.stateNode) {
    //如果此fiber没有创建DOM节点
    currentFiber.stateNode = createDOM(currentFiber)!;
  }
  const newChildren = currentFiber.props.children;
  reconcileChildren(currentFiber, newChildren);
}

function createDOM(currentFiber: IFiber) {
  if (currentFiber.tag === TAG_TEXT) {
    return document.createTextNode(currentFiber.props?.text!);
  } else if (currentFiber.tag === TAG_HOST) {
    let stateNode = document.createElement(currentFiber.type!);
    updateDOM(stateNode, {}, currentFiber.props);
    return stateNode;
  }
}

function updateDOM(stateNode: any, oldProps: any, newProps: any) {
  if (stateNode && stateNode.setAttribute)
    setProps(stateNode, oldProps, newProps);
}

function setProps(dom: any, oldProps: any, newProps: any) {
  for (let key in oldProps) {
    if (key !== "children") {
      if (newProps.hasOwnProperty(key)) {
        setProp(dom, key, newProps[key]); // 新老都有，则更新
      } else {
        dom.removeAttribute(key); //老props里有此属性，新 props没有，则删除
      }
    }
  }
  for (let key in newProps) {
    if (key !== "children") {
      if (!oldProps.hasOwnProperty(key)) {
        //老的没有，新的有，就添加此属性
        setProp(dom, key, newProps[key]);
      }
    }
  }
}

function setProp(dom: any, key: any, value: any) {
  if (/^on/.test(key)) {
    //onClick
    dom[key.toLowerCase()] = value; //没有用合成事件
  } else if (key === "style") {
    if (value) {
      for (let styleName in value) {
        dom.style[styleName] = value[styleName];
      }
    }
  } else {
    dom.setAttribute(key, value);
  }
}

// diff，生成子fiber，并建立索引关系，打tag
function reconcileChildren(currentFiber: IFiber, newChildren: any[]) {
  let newChildIndex = 0;
  let prevSibling: IFiber;

  // 有alternate熟悉说明非首次渲染，需要diff更新
  // 老的child是个链表，新的child是一个数组
  let oldFiber = currentFiber.alternate && currentFiber.alternate.child;
  if (oldFiber)
    oldFiber.firstEffect = oldFiber.nextEffect = oldFiber.lastEffect = null;
  // 遍历每个元素，一一对应生成fiber节点
  while (newChildIndex < newChildren.length || oldFiber) {
    let newChild = newChildren[newChildIndex];
    let newFiber: IFiber; //新的Fiber
    const sameType = oldFiber && newChild && oldFiber.type === newChild.type;

    let tag: Symbol | typeof TAG_TEXT | typeof TAG_HOST;

    if (
      newChild &&
      typeof newChild.type === "function" &&
      newChild.type.isReactComponent
    ) {
      tag = TAG_CLASS;
    } else if (newChild && typeof newChild.type === "function") {
      tag = TAG_FUNCTION_COMPONENT;
    } else if (newChild && newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (newChild && typeof newChild.type === "string") {
      // 说明是原生DOM节点
      tag = TAG_HOST;
    }

    if (sameType) {
      if (oldFiber?.alternate) {
        // 说明至少更新一次了，复用fiber，不再重新生成
        newFiber = oldFiber.alternate;
        newFiber.props = newChild.props;
        newFiber.alternate = oldFiber;
        newFiber.effectTag = UPDATE;
        newFiber.nextEffect = null;
      } else {
        // 复用
        newFiber = {
          tag: oldFiber.tag,
          type: oldFiber.type,
          props: newChild.props, //  一定要用新的元素的props
          stateNode: oldFiber.stateNode, //div还没有创建DOM元素
          return: currentFiber, // 父Fiber returnFiber
          alternate: oldFiber, // 让新的fiber的alternate指向老的fiber节点
          effectTag: UPDATE, // 副作用标识 render我们要会收集副作用 增加 删除 更新
          nextEffect: null,
          firstEffect: null,
          lastEffect: null,
          sibling: null,
          updateQueue: oldFiber.updateQueue,
        };
      }
    } else {
      // 如果不能复用就新建然后删除
      if (newChild) {
        // 看看新的虚拟DOM是不是为null  {null}
        newFiber = {
          tag: tag!,
          type: newChild.type as string,
          props: newChild.props,
          stateNode: null,
          return: currentFiber,
          effectTag: PLACEMENT,
          sibling: null,
          nextEffect: null,
          firstEffect: null, // => 指向第一个有副作用的【子】fiber节点
          lastEffect: null, // => 指向最后一个有副作用的【子】fiber节点
          updateQueue: new UpdateQueue(),
        };
      }
      if (oldFiber) {
        oldFiber.effectTag = DELETION;
        deletions.push(oldFiber);
      }
    }

    if (oldFiber) {
      oldFiber = oldFiber.sibling; // oldFiber指针往后移动一次
    }

    if (newFiber) {
      if (newChildIndex === 0) {
        currentFiber.child = newFiber;
      } else {
        // @ts-ignore
        prevSibling.sibling = newFiber;
      }
      prevSibling = newFiber;
    }

    newChildIndex++;
  }
}

export function useReducer(reducer: Function | null, initialState: any) {
  let currentHook =
    workInProgressFiber?.alternate &&
    workInProgressFiber.alternate.hooks &&
    workInProgressFiber.alternate.hooks[hookIndex];

  if (currentHook) {
    // 非首次渲染
    currentHook.state = currentHook.updateQueue.forceUpdate(currentHook.state);
  } else {
    currentHook = {
      state: initialState,
      updateQueue: new UpdateQueue(),
    };
  }

  function dispatch(action: any) {
    let payload =
      typeof reducer === "function"
        ? reducer(currentHook.state, action)
        : action;
    currentHook.updateQueue.enqueueUpdate(new Update(payload));
    scheduleRoot();
  }

  workInProgressFiber.hooks[hookIndex++] = currentHook;

  return [currentHook.state, dispatch];
}

export function useState(initialState: any) {
  return useReducer(null, initialState);
}

// 一加载就开始执行 workLoop  源码中React预留的初始时间是5ms
window.requestIdleCallback(workLoop, { timeout: 500 });

export default scheduleRoot;
