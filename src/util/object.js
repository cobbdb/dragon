module.exports = {
    /**
     * Deep copy an array.
     * @parma {Array} arr
     * @return {Array}
     */
    cloneArray: function (arr) {
        var i, len = arr.length,
            clone = [];
        for (i = 0; i < len; i += 1) {
            clone.push(
                this.clone(arr[i])
            );
        }
        return clone;
    },
    /**
     * Deep copy an object.
     * @param {Object} root
     * @return {Object}
     */
    cloneObject: function (root) {
        var key, clone = {};
        if ('clone' in root && typeof root.clone === 'function') {
            return root.clone();
        }
        for (key in root) {
            clone[key] = this.clone(root[key]);
        }
        return clone;
    },
    /**
     * Deep copy any data type.
     * Utilizes clone() methods.
     * @param {Any} root
     * @return {Any} The clone.
     */
    clone: function (root) {
        if (root instanceof global.Array) {
            return this.cloneArray(root);
        } else if (typeof root === 'object') {
            return this.cloneObject(root);
        } else {
            return root;
        }
    },
    /**
     * Shallow merge properties from the right object
     * into the left object.
     * @param {Object} root
     * @param {Object} other
     * @param {Boolean} [deep] Defaults to false.
     * @return {Object}
     */
    mergeLeft: function (root, other, deep) {
        var key, target;
        root = root || {};
        other = other || {};
        target = deep ? this.clone(root) : root;

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
     * @param {Boolean} [deep] Defaults to false.
     * @return {Object}
     */
    mergeDefaults: function (root, other, deep) {
        var key, target;
        root = root || {};
        other = other || {};
        target = deep ? this.clone(root) : root;

        for (key in other) {
            if (!(key in target) || typeof target[key] === 'undefined') {
                target[key] = other[key];
            }
        }
        return target;
    }
};
