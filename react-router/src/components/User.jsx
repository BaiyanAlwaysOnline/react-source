const User = (props) => {
  console.log(props);
  const push = (path) => {
    props.history.push(path, {});
  };
  const goBack = () => {
    props.history.goBack();
  };
  return (
    <div>
      {/* <button onClick={goBack}>User goBack</button>
      <button onClick={() => push("/home")}>To Home</button>
      <button onClick={() => push("/")}>To Welcome</button> */}
      User
    </div>
  );
};

export default User;
