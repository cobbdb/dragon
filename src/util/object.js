module.exports = {
    /**
     * Shallow merge properties from the right object
     * into the left object.
     * @param {Object} root
     * @param {Object} other
     */
    mergeLeft: function (root, other) {
        var key;
        root = root || {};
        other = other || {};
        for (key in other) {
            root[key] = other[key];
        }
    },
    /**
     * Shallow merge default properties from right
     * to left.
     * @param {Object} root
     * @param {Object} other
     */
    mergeDefaults: function (root, other) {
        var key;
        root = root || {};
        other = other || {};
        for (key in other) {
            if (!(key in root)) {
                root[key] = other[key];
            }
        }
    }
};
