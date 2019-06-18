const assert = require('assert');
const { words, _words, __words } = require('../src/functionStyle');

describe('function style', function() {
    it('words should equal _words', function() {
        const wordsInput = 'hello world my baby'
        assert.equal(words(wordsInput).toString(), _words(wordsInput).toString())
    });

    it('_words result should be [hello, world, my, baby]', function() {
        const wordsInput = 'hello world my baby'
        const re = _words(wordsInput);
        assert.equal('baby', re[3])
        assert.equal('my', re[2])
        assert.equal('world', re[1])
        assert.equal('hello', re[0])
    });

    it('__words is function', function() {
        assert.equal(typeof __words, 'function')
    }),
    
    it('__words can split string array', function() {
        const re = __words(['he la', 'add mm p']);
        assert.equal(re instanceof Array, true);
        assert.equal(re[0][0], 'he');
        assert.equal(re[0][1], 'la');
        assert.equal(re[1][1], 'mm');
    })

});