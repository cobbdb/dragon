function _Rectangle(x, y, w, h) {
    return _Shape(x, y).extend({
        width: w,
        height: h,
        right: x + w,
        bottom: y + h,
        move: function (x, y) {
            this.base.move(x, y);
            this.right = x + this.width;
            this.bottom = y + this.height;
        },
        collide: function (other) {
            other.collideWith.rect(this);
        },
        collideWith: {
            rect: function (other) {
                return (
                    this.x < other.right &&
                    this.right > other.x &&
                    this.y < other.bottom &&
                    this.bottom > other.y
                );
            },
            circle: function (circ) {
                var len, pt = _Point(circ.x, circ.y);
                if (circ.x > this.right) pt.x = this.right;
                else if (circ.x < this.x) pt.x = this.x;
                if (circ.y > this.bottom) pt.y = this.bottom;
                else if (circ.y < this.y) pt.y = this.y;

                len = Vector.length(pt.x, pt.y, circ.x, circ.y);
                return len < circle.radius;
            }
        }
    });
}
