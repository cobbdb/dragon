/**
 * # Point
 * @param {Number} x
 * @param {Number} y
 * @return {Point}
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
         * @param {Point} offset
         * @param {Boolean} [shallow] True to mutate.
         * @return {Point} This point after shifting.
         */
        shift: function (offset, shallow) {
            var target = shallow ? this : this.clone();
            target.x += offset.x;
            target.y += offset.y;
            return target;
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
        }
    };
}

module.exports = Point;
