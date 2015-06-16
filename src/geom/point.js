/**
 * @class Point
 * @param {Number} x
 * @param {Number} y
 */
function Point(x, y) {
    return {
        x: x || 0,
        y: y || 0,
        /**
         * @return {Point}
         */
        clone: function () {
            return Point(this.x, this.y);
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
         * @param {Point} offset
         * @param {Boolean} [shallow] True to mutate.
         * @return {Point|Vector} This point after shifting.
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
}

module.exports = Point;
