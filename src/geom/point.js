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
         * @param {Point|Vector} offset
         * @param {Boolean} [shallow] True to mutate.
         * @return {Point} This point after shifting.
         */
        multiply: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.x *= scale.x;
            target.y *= scale.y;
            return target;
        },
        divide: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.x /= scale.x;
            target.y /= scale.y;
            return target;
        },
        add: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.x += scale.x;
            target.y += scale.y;
            return target;
        },
        subtract: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.x -= scale.x;
            target.y -= scale.y;
            return target;
        }
    };
    return self;
};
