function _Vector(x1, y1, x2, y2) {
    return {
        extend: BaseClass,
        start: _Point(x, y),
        end: _Point(x2, y2),
        length: _Vector.length(x1, y1, x2, y2)
    };
}
_Vector.length = function (x1, y1, x2, y2) {
    var rise = (y1 - y2) * (y1 - y2),
        run = (x1 - x2) * (x1 - x2);
    return Math.sqrt(rise + run);
};
