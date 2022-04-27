import useReactReduxContext from "./useReactReduxContext";

const useDispatch = () => useReactReduxContext().dispatch;

export default useDispatch;
