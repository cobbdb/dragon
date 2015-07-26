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
// Account for both 0.00 and -0.00.
sine['-0.00'] = sine['0.00'];
cosine['-0.00'] = cosine['0.00'];

module.exports = {
    PI: 3.14159, // <-- TODO: Test if this is actually faster or not
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
    }
};
