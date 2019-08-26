const a = next => action => {
    next(action);
    console.log('a', action.toString());
};
const b = next => action => {
    console.log('b', action);
    next(action);
};
function dispatch(action) {
    console.log('after all middleware finish', action);
}
function compose(...funcs) {
    if (funcs.length === 0) {
        return arg => arg;
    }

    if (funcs.length === 1) {
        return funcs[0];
    }

    return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
let d = compose(
    a,
    b
);
d(dispatch)('true action');
