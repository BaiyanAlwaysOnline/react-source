import { ELEMENT_TEXT } from "../src/constants";
import { ReactElement } from "react";

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

function cleanProperty(props: any) {
  delete props.__self;
  delete props.__source;
}

let react = {
  createElement,
};

export default react;
