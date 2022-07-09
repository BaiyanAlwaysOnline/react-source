import { IFiber } from "./react-dom";
import {
  ELEMENT_TEXT,
  PLACEMENT,
  TAG_HOST,
  TAG_ROOT,
  TAG_TEXT,
} from "../src/constants";

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
// 下一个要处理的工作单元（fiber）
let nextUnitOfWork: undefined | IFiber = undefined;

function schedule(fiber: IFiber) {
  workInProgressRoot = nextUnitOfWork = fiber;
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
  let currentFiber = workInProgressRoot?.firstEffect; // effectLis副作用链表t的头节点；
  while (currentFiber) {
    commitWork(currentFiber);
    currentFiber = currentFiber.nextEffect;
  }
  workInProgressRoot = null;
}

function commitWork(currentFiber: IFiber) {
  if (!currentFiber) return;
  let returnFiber = currentFiber.return;
  let renderDOM = returnFiber?.stateNode;
  // 新增
  if (currentFiber.effectTag === PLACEMENT) {
    renderDOM && renderDOM.appendChild(currentFiber?.stateNode!);
  }
  currentFiber.effectTag = null;
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
  switch (currentFiber.tag) {
    case TAG_ROOT: // 根节点
      updateHostRoot(currentFiber);
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

// 生成子fiber，并建立索引关系
function reconcileChildren(currentFiber: IFiber, newChildren: any[]) {
  let newChildIndex = 0;
  let prevSibling: IFiber;
  // 遍历每个元素，一一对应生成fiber节点
  while (newChildIndex < newChildren.length) {
    let newChild = newChildren[newChildIndex];
    let tag: Symbol | typeof TAG_TEXT | typeof TAG_HOST;
    if (newChild.type === ELEMENT_TEXT) {
      tag = TAG_TEXT;
    } else if (typeof newChild.type === "string") {
      // 说明是原生DOM节点
      tag = TAG_HOST;
    }

    let newFiber: IFiber = {
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
    };

    if (newChildIndex === 0) {
      currentFiber.child = newFiber;
    } else {
      // @ts-ignore
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;

    newChildIndex++;
  }
}

// 一加载就开始执行 workLoop  源码中React预留的初始时间是5ms
window.requestIdleCallback(workLoop, { timeout: 500 });

export default schedule;
