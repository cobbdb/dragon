/**
 * @class Vector
 * @param {Number} [x] Defaults to 0.
 * @param {Number} [y] Defaults to 0.
 */
function Vector(x, y) {
    return {
        x: x || 0,
        y: y || 0,
        get magnitude () {
            return Math.abs(
                Math.sqrt(
                    (this.y * this.y) +
                    (this.x * this.x)
                )
            );
        },
        clone: function () {
            return Vector(
                this.x,
                this.y
            );
        },
        equals: function (other) {
            return (
                this.x === other.x &&
                this.y === other.y
            );
        },
        toPolar: function () {
            var Polar = require('./polar.js');
            return Polar(
                Math.atan(this.y / this.x),
                this.magnitude
            );
        },
        /**
         * @param {Vector} scale
         */
        multiply: function (scale) {
            this.x *= scale.x;
            this.y *= scale.y;
            return this;
        },
        divide: function (scale) {
            this.x /= scale.x;
            this.y /= scale.y;
            return this;
        },
        add: function (scale) {
            this.x += scale.x;
            this.y += scale.y;
            return this;
        },
        subtract: function (scale) {
            this.x -= scale.x;
            this.y -= scale.y;
            return this;
        }
    };
}

module.exports = Vector;
