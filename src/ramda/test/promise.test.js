const adapter = require('../src/promise');

describe("Promises/A+ Tests", function () {
    require("promises-aplus-tests").mocha(adapter);
});