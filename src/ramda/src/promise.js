const isFunction = x => typeof x === 'function';
const nextTick = process.nextTick.bind(process);
// 1.2 “thenable” is an object or function that defines a then method.
class thenable {
    constructor() {
        // 1.3 “value” is any legal JavaScript value (including undefined, a thenable, or a promise).
        this.value = undefined;
        // 1.4 “exception” is a value that is thrown using the throw statement.
        this.exception = undefined;
        // “reason” is a value that indicates why a promise was rejected.
        this.reason = undefined;

        // 2.1 A promise must be in one of three states: pending, fulfilled, or rejected.
        this['[[ThenableStatus]]'] = 'pending';

        this.callbacks = [];
    }
    then(onFulfilled, onRejected) {
        if(isFunction(onFulfilled)) {
            if(this['[[ThenableStatus]]'] === 'pending') {
                this.callbacks.push({
                    type: true,
                    fn: onFulfilled
                });
            }
            if(this['[[ThenableStatus]]'] === 'fulfilled') {
                nextTick(() => {
                    onFulfilled(this.value);
                })
            }
        }
        if(isFunction(onRejected)) {
            if(this['[[ThenableStatus]]'] === 'pending') {
                this.callbacks.push({
                    type: false,
                    fn: onRejected
                });
            }
            if(this['[[ThenableStatus]]'] === 'rejected') {
                nextTick(() => {
                    onRejected(this.reason);
                })
            }
        }
        return this;
    }
    catch(onRejected) {
        if(isFunction(onRejected)) {
            if(this['[[ThenableStatus]]'] === 'pending') {
                this.callbacks.push({
                    type: false,
                    fn: onRejected
                });
            }
            if(this['[[ThenableStatus]]'] === 'rejected') {
                nextTick(() => {
                    onRejected(this.reason);
                })
            }
        }
        return this;
    }
}

// 1.1 “promise” is an object or function
// with a then method whose behavior conforms to this specification.
class MPromise extends thenable{
    constructor(registor) {
        super(registor);
        registor(this.resolve.bind(this), this.reject.bind(this));
    }
    static resolve(value) {

    }
    static reject(value) {

    }
    resolve(value) {
        if(this['[[ThenableStatus]]'] === 'pending') {
            this.value = value;
            this['[[ThenableStatus]]'] = 'fulfilled';
            nextTick(this.runResolveCallbacks.bind(this));
        }
    }
    reject(reason) {
        if(this['[[ThenableStatus]]'] === 'pending') {
            this.reason = reason;
            this['[[ThenableStatus]]'] = 'rejected';
            nextTick(this.runRejectCallbacks.bind(this));
        }
    }
    runResolveCallbacks() {
        this.reduceCallback(this.callbacks, this.value, true);
    }
    runRejectCallbacks() {
        this.reduceCallback(this.callbacks, this.reason, false);
    }
    reduceCallback(ary, value, isResolve) {
        let current;
        while(ary.length) {
            current = ary.shift();
            if(current.type !== isResolve) {
                continue;
            }
            value = current.fn(value)

            if(value instanceof thenable) {
                value.then((ret) => {
                    this.reduceCallback(ary, ret, true);
                }).catch((reason) => {
                    this.reduceCallback(ary, reason, false);
                })
                break;
            }
        }
    }
}
setTimeout(_ => console.log(4))

new MPromise(resolve => {
  resolve()
  console.log(1)
}).then(_ => {
  console.log(3)
})

console.log(2)



// new MPromise((res, rej) => {
//     rej(reason);
// })
module.exports = MPromise;