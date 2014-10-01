function _Circle(x, y, r) {
    return _Shape(x, y).extend({
        radius: r,
        collide: function (other) {
            other.collideWith.circle(this);
        },
        collideWith: {
            circle: function (other) {
                var len = Vector.length(this.x, this.y, other.x, other.y);
                return len < this.rad + other.rad;
            },
            rect: function (rect) {
                var len, pt = {
                    x: this.x,
                    y: this.y
                };
                if (this.x > rect.right) pt.x = rect.right;
                else if (this.x < rect.x) pt.x = rect.x;
                if (this.y > rect.bottom) pt.y = rect.bottom;
                else if (this.y < rect.y) pt.y = rect.y;

                len = Vector.length(pt.x, pt.y, this.x, this.y);
                return len < circle.radius;
            }
        }
    });
}
