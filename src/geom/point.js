var ZERO = require('./zero.js');

/**
 * @class Point
 * @param {Number} x
 * @param {Number} y
 */
module.exports = function (x, y) {
    var self = {
        x: x || 0,
        y: y || 0,
        /**
         * @return {Point}
         */
        clone: function () {
            return module.exports(this.x, this.y);
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
        is: {
            /**
             * @return {Boolean} True if equal to (0,0).
             */
            get zero () {
                return self.equals(ZERO);
            }
        },
        /**
         * @param {Point} pos
         * @param {Boolean} [shallow] True to mutate.
         * @return {Point} This point after moving.
         */
        move: function (pos, shallow) {
            var target = shallow ? this : this.clone();
            target.x = pos.x;
            target.y = pos.y;
            return target;
        },
        /**
         * @param {Point|Vector} factor
         * @param {Boolean} [shallow] True to mutate.
         * @return {Point} This point after shifting.
         */
        multiply: function (factor, shallow) {
            var target = shallow ? this : this.clone();
            target.x *= factor.x;
            target.y *= factor.y;
            return target;
        },
        divide: function (factor, shallow) {
            var target = shallow ? this : this.clone();
            target.x /= factor.x;
            target.y /= factor.y;
            return target;
        },
        /**
         * @param {Point|Vector} offset
         * @param {Boolean} [shallow] True to mutate.
         * @return {Point} This point after shifting.
         */
        add: function (offset, shallow) {
            var target = shallow ? this : this.clone();
            target.x += offset.x;
            target.y += offset.y;
            return target;
        },
        subtract: function (offset, shallow) {
            var target = shallow ? this : this.clone();
            target.x -= offset.x;
            target.y -= offset.y;
            return target;
        }
    };
    return self;
};
