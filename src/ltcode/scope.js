function A() {
    const ret = []
    for(let i=0; i< 5; i++) {
        ret[i] = function() { console.log(i) }
    }
    return ret;
}
let r1 = A()
for(let j = 0; j < 5; j++) {
    r1[j]()
}

function B() {
    const ret = []
    for(var i=0; i< 5; i++) {
        ret[i] = function() { console.log(i) }
    }
    return ret;
}
let r2 = A()
for(let k = 0; k < 5; k++) {
    r2[k]()
}