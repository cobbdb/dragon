var ZERO = require('./zero.js');

/**
 * @class Point
 * @param {Number} x
 * @param {Number} y
 */
module.exports = function (x, y) {
    return {
        x: x || 0,
        y: y || 0,
        /**
         * @return {Point}
         */
        clone: function () {
            return module.exports(this.x, this.y);
        },
        set: function (other) {
            this.x = other.x;
            this.y = other.y;
            return this;
        },
        setFixed: function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        /**
         * @param {Point} other
         * @return {Boolean}
         */
        equals: function (other) {
            return (
                this.x === other.x &&
                this.y === other.y
            );
        },
        /**
         * @return {Point}
         */
        floor: function () {
            this.x = global.Math.floor(this.x);
            this.y = global.Math.floor(this.y);
            return this;
        },
        /**
         * @return {Boolean} True if equal to (0,0).
         */
        isZero: function () {
            return this.equals(ZERO);
        },
        /**
         * @param {Point} pos
         * @return {Point} This point after moving.
         */
        move: function (pos) {
            this.x = pos.x;
            this.y = pos.y;
            return this;
        },
        /**
         * @param {Number} x
         * @param {Number} y
         * @return {Point}
         */
        moveFixed: function (x, y) {
            this.x = x;
            this.y = y;
            return this;
        },
        /**
         * @param {Point|Vector} factor
         * @return {Point} This point after shifting.
         */
        multiply: function (factor) {
            this.x *= factor.x;
            this.y *= factor.y;
            return this;
        },
        /**
         * @param {Number} x
         * @param {Number} y
         * @return {Point}
         */
        multiplyFixed: function (x, y) {
            this.x *= x;
            this.y *= y;
            return this;
        },
        divide: function (factor) {
            this.x /= factor.x;
            this.y /= factor.y;
            return this;
        },
        divideFixed: function (x, y) {
            this.x /= x;
            this.y /= y;
            return this;
        },
        add: function (offset) {
            this.x += offset.x;
            this.y += offset.y;
            return this;
        },
        addFixed: function (x, y) {
            this.x += x;
            this.y += y;
            return this;
        },
        subtract: function (offset) {
            this.x -= offset.x;
            this.y -= offset.y;
            return this;
        },
        subtractFixed: function (x, y) {
            this.x -= x;
            this.y -= y;
            return this;
        }
    };
};
