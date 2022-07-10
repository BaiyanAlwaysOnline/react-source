import { ELEMENT_TEXT } from "../src/constants";
import { ReactElement } from "react";
import { Update, UpdateQueue } from "./update";
import scheduleRoot, {
  hookIndex,
  useReducer,
  useState,
  workInProgressFiber,
} from "./schedule";

function createElement(type: string, props: any, ...children: ReactElement[]) {
  cleanProperty(props);
  return {
    type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object"
          ? child
          : {
              type: ELEMENT_TEXT,
              props: {
                text: child,
                children: [],
              },
            }
      ),
    },
  };
}

abstract class Component {
  props: any;
  internalFiber: any;
  state: {};
  static isReactComponent: {};
  protected constructor(props: any) {
    this.props = props;
    this.state = {};
  }

  abstract render(): any;

  setState(payload) {
    let update = new Update(payload);
    // updateQueue其实是放在此类组件对应的fiber节点的 internalFiber
    // fiber.stateNode => classInstance ==.internalFiber ===> fiber
    this.internalFiber.updateQueue.enqueueUpdate(update);
    scheduleRoot();
  }
}

Component.isReactComponent = {};

function cleanProperty(props: any) {
  delete props.__self;
  delete props.__source;
}

let react = {
  createElement,
  Component,
  useReducer,
  useState,
};

export default react;
