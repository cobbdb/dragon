function _Shape(x, y) {
    return {
        extend: BaseClass,
        x: x || 0,
        y: y || 0,
        move: function (x, y) {
            this.x = x;
            this.y = y;
        },
        collidesWith: function () {
            return false;
        }
    };
}
