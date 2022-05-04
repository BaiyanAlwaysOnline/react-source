function* gen() {
  /* ===== gen() ===== */
  console.log("run");
  /* ===== it.next() ===== */
  const res1 = yield 1;
  /* ===== it.next(res1) ===== */
  console.log(res1, "res1");
  const res2 = yield 2;
  /* ===== it.next(res2) ===== */
  console.log(res2, "res2");
}

const it = gen();

it.next("11");
// it.next("22");
// it.next("33");
