interface Stack {
    stack: Array <number>
    adjust(): void
    swapMin(num: number): void
    getMin(): number
    getMid(): number
}
class minStack implements Stack{
    stack: Array <number>
    constructor(nums: Array <number>) {
        this.stack = nums;
        this.adjust();
    }
    adjust() {
        const mid = ~~(this.stack.length / 2), len = this.stack.length;
        let i = 0;
        while(i <= mid) {
            let left = 2 * i + 1, right = left + 1;
            if(left < len && this.stack[left] < this.stack[i]) {
                this.swap(i, left)
            }
            if(right < len && this.stack[right] < this.stack[i]) {
                this.swap(i, right)
            }
            i++;
        }
    }
    swap(i: number, j: number) {
        let tmp = this.stack[i]
        this.stack[i] = this.stack[j]
        this.stack[j] = tmp;
    }
    swapMin(min: number) {
        this.stack[0] = min;
        this.adjust();
    }
    getMin() {
        return this.stack[0];
    }
    getMid() {
        return (this.stack[0] + Math.min(this.stack[1], this.stack[2])) / 2
    }
}

// 寻找中位数 第k大的数
// [1,2,3,4,5] => 3 
function findMidNumber(ary?: Array < number > ): number {
    let i = ~~(ary.length/2) + 1;
    const m = new minStack(ary.slice(0, ~~(i/2) + 2));
    while(i < ary.length) {
        if(ary[i] > m.getMin()) {
            m.swapMin(ary[i])
        }
        i++
    }
    if(ary.length & 1) {
        return m.getMin()
    }
    return m.getMid();
}
console.log(findMidNumber([2,3,1,4]))