const assert = require('assert');
const P = require('../index');

describe('test type function', function() {
    describe('input null', function() {
        it('should equal Null', function() {
            assert.equal(P.type(null), 'Null');
        });
    });

    describe('input undefined', function() {
        it('should equal undefined', function() {
            assert.equal(P.type(undefined), 'Undefined');
        });
    });

    describe('input 1', function() {
        it('should equal Number', function() {
            assert.equal(P.type(1), 'Number');
        });
    });

    describe('input "1"', function() {
        it('should equal String', function() {
            assert.equal(P.type('1'), 'String');
        });
    });

    describe('input [1]', function() {
        it('should equal Array', function() {
            assert.equal(P.type([1]), 'Array');
        });
    });
});
