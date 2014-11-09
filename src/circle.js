var Shape = require('./shape.js'),
    Vector = require('./vector.js');

module.exports = function (x, y, r) {
    var self = Shape(x, y).extend({
        radius: r,
        intersects: function (other) {
            return other.intersects.circle(this);
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.fillStyle = 'rgba(250, 50, 50, 0.5)';
            ctx.fill();
        }
    });
    self.intersects.circle = function (other) {
        var len = Vector.length(this.x, this.y, other.x, other.y);
        return len < this.rad + other.rad;
    };
    self.intersects.rect = function (rect) {
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
    };
    return self;
};
