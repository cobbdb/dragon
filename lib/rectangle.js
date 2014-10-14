var Shape = require('./shape.js');

module.exports = function (x, y, w, h) {
    var self = Shape(x, y).extend({
        width: w || 0,
        height: h || 0,
        right: x + w || 0,
        bottom: y + h || 0,
        move: function (x, y) {
            this.base.move(x, y);
            this.right = x + this.width;
            this.bottom = y + this.height;
        },
        intersects: function (other) {
            return other.intersects.rect(this);
        }
    });
    self.intersects.rect = function (other) {
        return (
            this.x < other.right &&
            this.right > other.x &&
            this.y < other.bottom &&
            this.bottom > other.y
        );
    };
    self.intersects.circle = function (circ) {
        var len, pt = _Point(circ.x, circ.y);
        if (circ.x > this.right) pt.x = this.right;
        else if (circ.x < this.x) pt.x = this.x;
        if (circ.y > this.bottom) pt.y = this.bottom;
        else if (circ.y < this.y) pt.y = this.y;

        len = Vector.length(pt.x, pt.y, circ.x, circ.y);
        return len < circle.radius;
    };
    return self;
};
