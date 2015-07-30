var random = require('./random.js');

module.exports = {
    /**
     * @param {Array} arr
     * @return {Array}
     */
    shuffle: function (arr) {
        var i, j, x;
        for (i = 0; i < arr.length; i += 1) {
            j = parseInt(
                random() * (i + 1)
            );
            x = arr[i];
            arr[i] = arr[j];
            arr[j] = x;
        }
        return arr;
    },
    /**
     * @param {Number} start
     * @param {Number} end
     * @return {Array}
     */
    range: function (start, end) {
        var i, len,
            arr = [];

        if (!end) {
            end = start;
            start = 0;
        }

        len = end - start;
        for (i = 0; i < len; i += 1) {
            arr.push(i + start);
        }
        return arr;
    },
    /**
     * Replacement for Array.prototype.concat(). Performs
     * between 60k - 100k times faster!
     * Uses the first argument as host if possible.
     * @see concat()
     * @param {Any} * Any number of arguments.
     * @return {Array}
     */
    concatLeft: function () {
        var i, len = arguments.length,
            pivot, arr;
        if (arguments[0] && arguments[0].push) {
            arr = arguments[0];
            i = 1;
        } else {
            arr = [];
            i = 0;
        }
        for (i; i < len; i += 1) {
            pivot = arguments[i];
            if (pivot || pivot === 0 || pivot === '') {
                if (pivot.push) {
                    arr.push.apply(arr, pivot);
                } else {
                    arr.push(pivot);
                }
            }
        }
        return arr;
    },
    /**
     * Replacement for Array.prototype.concat(). Performs
     * between 60k - 100k times faster!
     * Creates a new array.
     * @param {Any} Any number of arguments.
     * @return {Array}
     */
    concat: function () {
        var i, len = arguments.length,
            pivot,
            arr = [];
        for (i = 0; i < len; i += 1) {
            pivot = arguments[i];
            if (pivot || pivot === 0 || pivot === '') {
                if (pivot.push) {
                    arr.push.apply(arr, pivot);
                } else {
                    arr.push(pivot);
                }
            }
        }
        return arr;
    },
    /**
     * @param {Any} item
     * @return {Array}
     */
    array: function (item) {
        if (item) {
            return item.push ? item : [item];
        }
        return [];
    }
};
