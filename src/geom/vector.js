var ZERO = require('./zero.js'),
    Num = require('../util/number.js');

/**
 * @class Vector
 * @param {Number} [x] Defaults to 0.
 * @param {Number} [y] Defaults to 0.
 */
module.exports = function (x, y) {
    var self = {
        x: x || 0,
        y: y || 0,
        /**
         * @deprecated
         * Discouraged until replacement for sqrt is found.
         * @return {Number}
         */
        magnitude: function () {
            return global.Math.sqrt(
                global.Math.pow(this.x, 2) +
                global.Math.pow(this.y, 2)
            );
        },
        /**
         * Calculate the discriminate of this vector's magnitude.
         * @return {Number}
         */
        D: function () {
            return (
                global.Math.pow(this.x, 2) +
                global.Math.pow(this.y, 2)
            );
        },
        clone: function () {
            return module.exports(
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
        is: {
            /**
             * @return {Boolean} True if equal to <0,0>.
             */
            get zero () {
                return self.equals(ZERO);
            }
        },
        /**
         * @slow
         */
        toPolar: function () {
            var Polar = require('./polar.js');
            return Polar(
                global.Math.atan(this.y / this.x),
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
    return self;
};
