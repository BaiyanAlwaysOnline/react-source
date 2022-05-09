const person = {
  name: "by",
  list: [1],
};

const proxyPerson = new Proxy(person, {
  get(target, key) {
    return Reflect.get(target, key);
  },
  set(target, key, value) {
    console.log("proxyPerson set", key, value);
    Reflect.set(target, key, value);
  },
});

console.log(proxyPerson.name);
proxyPerson.name = "lmd";
console.log(proxyPerson.name);

proxyPerson.list.push(2);
