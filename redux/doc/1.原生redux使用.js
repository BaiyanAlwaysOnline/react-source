const text = document.querySelector("#text");
const add = document.querySelector("#add");
const minus = document.querySelector("#minus");
const ADD = "ADD";
const MINUS = "MINUS";

const reducer = (state = { num: 0 }, action) => {
  switch (action.type) {
    case ADD:
      return { num: state.num + 1 };
    case MINUS:
      return { num: state.num - 1 };
    default:
      return state;
  }
};
const store = createStore(reducer);

function render() {
  text.innerText = store.getState().num;
}

render();

add.addEventListener("click", () => {
  store.dispatch({ type: ADD });
});

minus.addEventListener("click", () => {
  store.dispatch({ type: MINUS });
});

// 组件挂载时监听，组件卸载时移除监听
const unsubcribe = store.subscribe(render);
