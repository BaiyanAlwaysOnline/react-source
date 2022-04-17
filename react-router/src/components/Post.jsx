const Post = (props) => {
  console.log(props);
  return (
    <div>
      <div>Post</div>
      <div> id: {props.match.params.id}</div>
      <div>title: {props.location.state.title}</div>
    </div>
  );
};
/**
 *  1. 把路径转成正则，然后跟url里面的pathname匹配
 *  2. 拼装成match对象传给路由渲染出的组件
 *
 */
export default Post;
