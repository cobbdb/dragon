module.exports = {
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
    mergeDefaults: function (root, other) {
        var key;
        for (key in other) {
            if (!(key in root)) {
                root[key] = other[key];
            }
        }
    }
};
