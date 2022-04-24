const compose = (...func) => {
  return func.reduce((f1, f2) => (val) => {
    return f1(f2(val));
  });
};

export default compose;
