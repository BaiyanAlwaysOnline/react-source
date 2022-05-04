/**
 * babel会将generate函数编译成switch case的形式
 */

const regeneratorRuntime = require("./regeneratorRuntime.js");

var _marked = regeneratorRuntime.mark(gen);

function gen() {
  var res1, res2, res3;
  return regeneratorRuntime.wrap(function gen$(_context) {
    switch ((_context.prev = _context.next)) {
      case 0:
        console.log("run");
        _context.next = 3;
        return 1;

      case 3:
        res1 = _context.sent;
        console.log("res1", res1);
        _context.next = 7;
        return 2;

      case 7:
        res2 = _context.sent;
        console.log("res2", res2);
        _context.next = 11;
        return 3;

      case 11:
        res3 = _context.sent;
        console.log("res3", res3);

      case 13:
      case "end":
        return _context.stop();
    }
  }, _marked);
}

const it = gen();

console.log(it.next());
console.log(it.next("next1"));
console.log(it.next("next2"));
console.log(it.next("next3"));

function* gen1() {
  console.log("run");
  const res1 = yield 1;
  console.log("res1", res1);

  const res2 = yield 2;
  console.log("res2", res2);

  const res3 = yield 3;
  console.log("res3", res3);
}
