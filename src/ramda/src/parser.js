// How to write a mini webpack? See
// https://github.com/chinanf-boy/minipack-explain/blob/master/src/minipack.js

const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const { transformFromAst } = require('babel-core');

const originCode = `
    import a from 'ad';

    function square(n) {
        return n*n;
    }
`;

const ast = babylon.parse(originCode, {
    // 'import' and 'export' may appear only with 'sourceType: "module"
    sourceType: 'module'
});

// The Babel Traverse module maintains the overall tree state, 
// and is responsible for replacing, removing, and adding nodes
traverse(ast, {
    enter(path) {
        if (path.isIdentifier({ name: "n" })) {
            path.node.name = "x";
        }
    },
    ImportDeclaration: ({ node }) => {
        console.log(node)
    },

});

const { code } = transformFromAst(ast, null, {
    presets: ['env']
});

console.log(code)