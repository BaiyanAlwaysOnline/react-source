/**
 *  1. 匹配捕获
 *  2. 匹配不捕获
 *  3. 正向肯定前瞻
 *  4. 正向否定前瞻
 */
// const str = "1ab";
// console.log("匹配捕获：", str.match(/^1([a-z])([a-z])/)); // 消费掉分组的内容，捕获 =>  [ '1ab', 'a', 'b', index: 0, input: '1ab', groups: undefined ]
// console.log(" ?: 匹配不捕获：", str.match(/^1(?:[a-z])([a-z])/)); // 消费掉分组的内容，但是不捕获 =>  [ '1ab', 'b', index: 0, input: '1ab', groups: undefined ]
// console.log(" ?= 正向肯定前瞻", str.match(/^1(?=[A-Z])([a-z])/)); // 不消费掉分组中的内容，看看后面是不是匹配的内容 =>  [ '1a', 'a', index: 0, input: '1ab', groups: undefined ]
// console.log(" ?! 正向否定前瞻", str.match(/^1(?![A-Z])([a-z])/)); // 不消费掉分组中的内容，看看后面是不是匹配的内容 =>  [ '1a', 'a', index: 0, input: '1ab', groups: undefined ]

/**
 *  贪婪匹配（默认）
 *  非贪婪匹配 ?加在量词后表示是非贪婪
 */

// const str = "1abc";
// console.log("贪婪匹配：", str.match(/^1([a-z])+/)); //  [ '1abc', 'c', index: 0, input: '1abc', groups: undefined ]
// console.log("非贪婪匹配：", str.match(/^1([a-z])+?/)); // [ '1a', 'a', index: 0, input: '1abc', groups: undefined ]
// console.log("？单独使用表示量词可有可无：", str.match(/^1([a-z])?/)); //  [ '1a', 'a', index: 0, input: '1abc', groups: undefined ]

/*========== 分割线 ========== */

// const { pathToRegexp } = require("path-to-regexp");

// const keys = [];
// const reg = pathToRegexp("/path/:id", keys, { end: false });
// const resultKeys = keys.map((k) => k.name);
// console.log(reg, resultKeys);
// const match = "/path/1".match(reg);
// console.log(match);
// const params = resultKeys.reduce((prev, curr, index) => {
//   prev[curr] = match[index + 1];
//   return prev;
// }, {});
// console.log(params);

const reg1 = /\/path\/([^\/]+?)(?=[\/#\?]|[]|$)/;
const reg2 = /^\/path(?:\/(.+?))(?:[\/#\?](?=[]|$))?(?=[\/#\?]|[]|$)/i;
const m1 = reg1.exec("/path/121/3/22");
const m2 = reg2.exec("/path/121/3/22");
console.log(m1);
console.log(m2);
