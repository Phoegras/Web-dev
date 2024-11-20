module.exports = {
    times: function (n, block) {
        let accum = '';
        for (let i = 0; i < n; i++) {
            accum += block.fn(i);
        }
        return accum;
    },
    floor: function (num) {
        return Math.floor(num);
    },

    ifEquals: function (arg1, arg2, options) {
        return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },

    eq: function (arg1, arg2) {
        return arg1 === arg2;
    },

    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    lt: (a, b) => a < b,
    gte: (a, b) => a >= b,
    range: (start, end) => {
        let range = [];
        for (let i = start; i <= end; i++) {
            range.push(i);
        }
        return range;
    },
};
