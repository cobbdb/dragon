var Shape = require('./shape.js'),
    Vector = require('./vector.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js');

/**
 * @param {Point} [pos] Defaults to (0,0).
 * @param {Number} [rad] Defaults to 0.
 */
module.exports = function (pos, rad) {
    pos = pos || Point();
    rad = rad || 0;

    var self = Shape(pos.x, pos.y).extend({
        radius: rad,
        intersects: function (other) {
            return other.intersects.circle(this);
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(250, 50, 50, 0.5)';
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
    self.intersects.circle = function (other) {
        var vect = Vector({
            start: this,
            end: other
        });
        return vect.size < this.radius + other.radius;
    };
    self.intersects.rect = function (rect) {
        var len,
            pt = Point(this.x, this.y);

        if (this.x > rect.right) pt.x = rect.right;
        else if (this.x < rect.x) pt.x = rect.x;
        if (this.y > rect.bottom) pt.y = rect.bottom;
        else if (this.y < rect.y) pt.y = rect.y;

        len = Vector.length(pt.x, pt.y, this.x, this.y);
        return len < circle.radius;
    };
    return self;
};
