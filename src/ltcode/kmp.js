/**
 * 求最大相同前后字串，以此求得next数组
 * @param {String} str 匹配字串
 * @return {Array}
 */
const assert = require('assert');

function preSubAfterSub(str) {
    if (!str) return [];
    assert(str.length > 0, 'target should not empty string');

    const ret = [0];
    let i = 1,
        k = 0;
    while (i < str.length) {
        if (str[i] === str[k]) {
            ret[i] = k + 1;
            k = ret[i];
            i++;
        } else if (k > 0) {
            k = ret[ret[k]];
        } else {
            ret[i] = 0;
            i++;
        }
    }
    ret.unshift(-1);
    ret.pop();
    return ret;
}

function kmp(ori, target) {
    const next = preSubAfterSub(target)
    let i = 0,
        j = 0;
    while (i < ori.length && j < target.length) {
        if (j === -1 || ori[i] === target[j]) {
            i++;
            j++;
        } else {
            j = next[j];
        }
    }
    if (j === target.length) {
        return i - target.length;
    }
    return -1;
}
