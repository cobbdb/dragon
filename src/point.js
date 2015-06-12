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
         * @return {Point} This point after shifting.
         */
        shift: function (offset) {
            this.x += offset.x;
            this.y += offset.y;
            return this;
        },
        /**
         * @param {Point} pos
         * @return {Point} This point after moving.
         */
        move: function (pos) {
            this.x = pos.x;
            this.y = pos.y;
            return this;
        }
    };
}

module.exports = Point;
