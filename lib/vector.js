function _Vector(x1, y1, x2, y2) {
    return {
        extend: BaseClass,
        start: _Point(x1, y1),
        end: _Point(x2, y2),
        length: function () {
            return _Vector.length(
                this.start.x, this.start.y,
                this.end.x, this.end.y
            );
        }
    };
}
_Vector.length = function (x1, y1, x2, y2) {
    var rise = (y1 - y2) * (y1 - y2),
        run = (x1 - x2) * (x1 - x2);
    return Math.sqrt(rise + run);
};

module.exports = _Vector;
