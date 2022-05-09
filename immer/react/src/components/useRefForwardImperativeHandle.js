let hookIndex = 0;
let hooks = [];

const useRef = (initialValue) => {
  hooks[hookIndex] = hooks[hookIndex] || { current: initialValue ?? null };
};

const useImperativeHandle = (ref, factory) => {
  ref.current = factory();
};
