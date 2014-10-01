function _Shape(x, y) {
    return {
        extend: BaseClass,
        x: x,
        y: y,
        move: function (x, y) {
            this.x = x;
            this.y = y;
        },
        collide: function () {},
        collideWith: {}
    };
}
