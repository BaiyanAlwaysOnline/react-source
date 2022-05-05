export default function prefixNamespace(model) {
  if (model.reducers) {
    model.reducers = prefix(model.reducers, model.namespace);
  }
  if (model.effects) {
    model.effects = prefix(model.effects, model.namespace);
  }
  return model;
}

function prefix(target, namespace) {
  return Object.keys(target).reduce((memo, key) => {
    memo[`${namespace}/${key}`] = target[key];
    return memo;
  }, {});
}
