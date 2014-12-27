var Vector = require('./vector.js');

function isEqual(my, other, tfactor, mfactor) {
    var mag = my.magnitude === mfactor * other.magnitude,
        mytheta = (my.theta % Math.PI).toFixed(5),
        otheta = ((other.theta + tfactor) % Math.PI).toFixed(5);
    return mag && (mytheta === otheta);
}

/**
 * @param {Number} [theta] Defaults to 0.
 * @param {Number} [mag] Defaults to 0.
 */
function Polar(theta, mag) {
    return {
        theta: theta || 0,
        magnitude: mag || 0,
        invert: function () {
            return Polar(
                this.theta + Math.PI,
                this.magnitude * -1
            );
        },
        clone: function () {
            return Polar(
                this.theta,
                this.magnitude
            );
        },
        toVector: function () {
            return Vector(
                this.magnitude * Math.cos(this.theta),
                this.magnitude * Math.sin(this.theta)
            );
        },
        equals: function (other) {
            return (
                isEqual(this, other, 0, 1) ||
                isEqual(this, other, Math.PI, -1)
            );
        }
    };
}

module.exports = Polar;
