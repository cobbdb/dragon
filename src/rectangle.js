var Shape = require('./shape.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    Vector = require('./vector.js');

/**
 * @param {Point} [pos] Defaults to (0,0).
 * @param {Dimension} [size] Defaults to (0,0).
 */
module.exports = function (pos, size) {
    pos = pos || Point();
    size = size || Dimension();

    var self = Shape(pos.x, pos.y).extend({
        width: size.width || 0,
        height: size.height || 0,
        right: pos.x + size.width || 0,
        bottom: pos.y + size.height || 0,
        move: function (x, y) {
            this.base.move(x, y);
            this.right = x + this.width;
            this.bottom = y + this.height;
        },
        intersects: function (other) {
            return other.intersects.rect(this);
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(250, 50, 50, 0.5)';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
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
        var vect,
            pt = Point(circ.x, circ.y);

        if (circ.x > this.right) pt.x = this.right;
        else if (circ.x < this.x) pt.x = this.x;
        if (circ.y > this.bottom) pt.y = this.bottom;
        else if (circ.y < this.y) pt.y = this.y;

        vect = Vector({
            start: pt,
            end: circ
        });
        return vect.size < circ.radius;
    };
    return self;
};
