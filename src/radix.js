//radixSort

/**
 * @param k: the max of input, used to create a range for our buckets
 * @param exp: 1, 10, 100, 1000, ... used to calculate the nth digit
 */
Array.prototype.countingSort = function (k, exp) {
    /* eslint consistent-this:0 */
    /* self of course refers to this array */
    const self = this;

    /**
     * let's say the this[i] = 123, if exp is 100 returns 1, if exp 10 returns 2, if exp is 1 returns 3
     * @param i
     * @returns {*}
     */
    function index(i) {
        if (exp)
            return Math.floor(Number(self[i].priority) / exp) % 10;
        return i;
    }

    const LENGTH = this.length;

    /* create an array of zeroes */
    let C = Array.apply(null, new Array(k)).map(() => 0);
    let B = [];

    for (let i = 0; i < LENGTH; i++){
        C[index(i)]++;
	}

    for (let i = 1; i < k; i++){
        C[i] += C[i - 1];
	}

    for (let i = LENGTH - 1; i >= 0; i--) {
        B[--C[index(i)]] = this[i].priority;
    }

    B.forEach((e, i) => {
        self[i].priority = Number(e);
    });
}
Array.prototype.radixSort = function () {
    const MAX = Math.max.apply(null, this.map((a)=>{return Number(a.priority);}));

    /* let's say the max is 1926, we should only use exponents 1, 10, 100, 1000 */
    for (let exp = 1; MAX / exp > 1; exp *= 10) {
        this.countingSort(10, exp);
    }
}

export default true;
