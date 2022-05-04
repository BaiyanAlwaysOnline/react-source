function* gen() {
  while (true) {
    yield console.log(new Date(), "gen");
  }
}
let it = gen();
// ! generate函数不会阻塞JS主线程，

it.next();
it.next();

setInterval(() => {
  console.log(new Date(), "setInterval");
}, 1000);
