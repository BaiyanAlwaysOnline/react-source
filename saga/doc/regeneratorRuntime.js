class Context {
  next = 0;
  done = false;
  stop() {
    this.done = true;
  }
}

exports.mark = function mark(gen) {
  return gen;
};

exports.wrap = function wrap(innerFunc, marked) {
  const context = new Context();
  const iterator = Object.create(marked.prototype);
  iterator.next = (sent) => {
    context.sent = sent;
    const value = innerFunc(context);
    return {
      done: context.done,
      value,
    };
  };
  return iterator;
};
