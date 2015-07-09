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
        get magnitude () {
            return Num.abs(
                global.Math.sqrt(
                    (this.y * this.y) +
                    (this.x * this.x)
                )
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
