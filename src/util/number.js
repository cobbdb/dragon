var i, key,
    sine = {},
    cosine = {};

/**
 * Frontload sine and cosine for a full positive
 * and negative unit circle.
 */
for (i = 6.28; i >= -6.28; i -= 0.01) {
    key = i.toFixed(2);
    sine[key] = global.Math.sin(i);
    cosine[key] = global.Math.cos(i);
}

module.exports = {
    PI: 3.14159,
    PI2: 6.28318,
    /**
     * @param {Number} theta
     * @return {Number}
     */
    sin: function (theta) {
        var key;
        theta %= this.PI2;
        key = theta.toFixed(2);
        return sine[key];
    },
    /**
     * @param {Number} theta
     * @return {Number}
     */
    cos: function (theta) {
        var key;
        theta %= this.PI2;
        key = theta.toFixed(2);
        return cosine[key];
    },
    /**
     * @param {Number} num
     * @return {Number}
     */
    abs: function (num) {
        return (num < 0) ? -num : num;
    }
};
