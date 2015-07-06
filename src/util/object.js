module.exports = {
    /**
     * Deep copy an object.
     * @param {Object} root
     * @return {Object} The clone.
     */
    clone: function (root) {
        var key, clone = {};
        for (key in root) {
            clone[key] = root[key];
        }
        return clone;
    },
    /**
     * Shallow merge properties from the right object
     * into the left object.
     * @param {Object} root
     * @param {Object} other
     * @param {Boolean} shallow Defaults to false.
     * @return {Object}
     */
    mergeLeft: function (root, other, shallow) {
        var key, target;
        root = root || {};
        other = other || {};
        target = shallow ? root : this.clone(root);

        for (key in other) {
            root[key] = other[key];
        }
        return root;
    },
    /**
     * Shallow merge default properties from right
     * to left.
     * @param {Object} root
     * @param {Object} other
     * @param {Boolean} [shallow] Defaults to false.
     * @return {Object}
     */
    mergeDefaults: function (root, other, shallow) {
        var key, target;
        root = root || {};
        other = other || {};
        target = shallow ? root : this.clone(root);

        for (key in other) {
            if (!(key in target) || typeof target[key] === 'undefined') {
                target[key] = other[key];
            }
        }
        return target;
    }
};
