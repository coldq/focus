const _ = require('ramda');
var curry = require('lodash').curry;

function split(reg, str) {
    return str.split(reg)
}
  
// 1
//==============
// 通过局部调用（partial apply）移除所有参数

const words = function(str) {
    return split(' ', str);
};
const _words = _.partial(split, [' ']);

// 1a
//==============
// 使用 `map` 创建一个新的 `words` 函数，使之能够操作字符串数组

const sentences = undefined;
const __words = _.map(_words)


module.exports = {
    words,
    _words,
    __words
}