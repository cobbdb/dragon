function _Circle(x, y, r) {
    var self = _Shape(x, y).extend({
        radius: r,
        collidesWith: function (other) {
            return other.collidesWith.circle(this);
        }
    });
    self.collidesWith.circle = function (other) {
        var len = _Vector.length(this.x, this.y, other.x, other.y);
        return len < this.rad + other.rad;
    };
    self.collidesWith.rect = function (rect) {
        var len, pt = {
            x: this.x,
            y: this.y
        };
        if (this.x > rect.right) pt.x = rect.right;
        else if (this.x < rect.x) pt.x = rect.x;
        if (this.y > rect.bottom) pt.y = rect.bottom;
        else if (this.y < rect.y) pt.y = rect.y;

        len = _Vector.length(pt.x, pt.y, this.x, this.y);
        return len < circle.radius;
    };
    return self;
}
