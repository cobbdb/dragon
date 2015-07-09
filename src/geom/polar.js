var Num = require('../util/number.js');

function isEqual(my, other, tfactor, mfactor) {
    var mag = my.magnitude === mfactor * other.magnitude,
        mytheta = (my.theta % Num.PI).toFixed(5),
        otheta = ((other.theta + tfactor) % Num.PI).toFixed(5);
    return mag && (mytheta === otheta);
}

/**
 * @param {Number} [theta] Defaults to 0.
 * @param {Number} [mag] Defaults to 0.
 */
module.exports = function (theta, mag) {
    return {
        theta: theta || 0,
        magnitude: mag || 0,
        invert: function () {
            return module.exports(
                this.theta + Num.PI,
                this.magnitude * -1
            );
        },
        clone: function () {
            return module.exports(
                this.theta,
                this.magnitude
            );
        },
        toVector: function () {
            var Vector = require('./vector.js');
            return Vector(
                this.magnitude * Num.cos(this.theta),
                this.magnitude * Num.sin(this.theta)
            );
        },
        equals: function (other) {
            return (
                isEqual(this, other, 0, 1) ||
                isEqual(this, other, Num.PI, -1)
            );
        }
    };
};
