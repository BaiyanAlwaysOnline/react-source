import useReactReduxContext from "./useReactReduxContext";

const useDispatch = () => useReactReduxContext().store.dispatch;

export default useDispatch;
