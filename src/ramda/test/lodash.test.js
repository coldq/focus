const _ = require('lodash')
const assert = require('assert');
function mul(a, b ,c) {
    return a*b*c;
}
const curry1 = _.curry(mul)

describe('Curry test', function() {
  describe('lodash', function() {
    it('should equal value', function() {
      assert.equal(curry1(1,2)(3), 6);
    });
  });
});




