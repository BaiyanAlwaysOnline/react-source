import { ReactElement } from "react";
import { EFFECT_TAG_TYPE, TAG_ROOT } from "../src/constants";
import schedule from "./schedule";

export interface IFiber {
  // 每个fiber都会有一个tag，标识此元素类型；
  tag: Symbol;
  // 如果这个元素是一个原生节点的话，stateNode指向真实DOM元素
  stateNode: Node | null;
  // 属性
  props: {
    // children存储的是vdom，会根据每个vdom创建对应的fiber节点
    children: ReactElement[];
    // 文本节点
    text?: string;
  };
  type?: string;
  // 父指针
  return?: IFiber;
  // 子指针
  child?: IFiber;
  // 兄弟指针
  sibling: IFiber | null;
  // 副作用标识
  effectTag: EFFECT_TAG_TYPE | null;
  // effect list（副作用单链表） 只包括有变化的fiber节点
  firstEffect: IFiber | null; // => 指向第一个有副作用的【子】fiber节点
  lastEffect: IFiber | null; // => 指向最后一个有副作用的【子】fiber节点
  nextEffect: IFiber | null; // => effectList 之间用 nextEffect 链接
  // 已经渲染的fiber树
  alternate?: IFiber | null;
}

function render(element: ReactElement, container: HTMLElement) {
  let rootFiber: IFiber = {
    tag: TAG_ROOT,
    stateNode: container,
    props: {
      children: [element],
    },
    sibling: null,
    effectTag: null,
    firstEffect: null, // => 指向第一个有副作用的【子】fiber节点
    lastEffect: null, // => 指向最后一个有副作用的【子】fiber节点
    nextEffect: null, // => effectList 之间用 nextEffect 链接
    alternate: null,
  };

  schedule(rootFiber);
}

export default {
  render,
};
