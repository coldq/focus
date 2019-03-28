const _ = require('lodash')
const assert = require('assert');
function mul(a, b ,c) {
    return a*b*c;
}
const curry1 = _.curry(mul)

describe('Array', function() {
  describe('lodash', function() {
    it('should equal value', function() {
      assert.equal(curry1(1,2)(3), 6);
    });
  });
  this.timeout(500);

  it('should take less than 500ms', function(done) {
    setTimeout(done, 300);
  });

  it('should take less than 500ms as well', function(done) {
    setTimeout(done, 250);
  });
});




