function* gen() {
  console.log("run");
  const res1 = yield 1;
  console.log("res1", res1);

  const res2 = yield 2;
  console.log("res2", res2);

  const res3 = yield 3;
  console.log("res3", res3);
}

const it = gen();

console.log(it.next());
console.log(it.next("next1"));
console.log(it.next("next2"));
console.log(it.next("next3"));
