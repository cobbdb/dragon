var random = require('./random.js');

module.exports = {
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
     * Merge properties from the right object into
     * the left object.
     * @param {Object} root
     * @param {Object} other
     */
    mergeLeft: function (root, other) {
        var key;
        for (key in other) {
            root[key] = other[key];
        }
    },
    mergeDefault: function (root, other) {
        var key;
        for (key in other) {
            if (!(key in root)) {
                root[key] = other[key];
            }
        }
    }
};
