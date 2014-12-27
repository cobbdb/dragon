var Shape = require('./shape.js'),
    Vector = require('./vector.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js');

/**
 * @param {Point} [pos] Defaults to (0,0).
 * @param {Number} [rad] Defaults to 0.
 */
module.exports = function (pos, rad) {
    return Shape({
        pos: pos || Point(),
        name: 'circle',
        intersects: {
            rectangle: function (rect) {
                var vect,
                    pt = Point(this.x, this.y);

                if (this.x > rect.right) pt.x = rect.right;
                else if (this.x < rect.x) pt.x = rect.x;
                if (this.y > rect.bottom) pt.y = rect.bottom;
                else if (this.y < rect.y) pt.y = rect.y;

                vect = Vector(
                    this.x - pt.x,
                    this.y - pt.y
                );
                return vect.magnitude < this.radius;
            },
            circle: function (circ) {
                var vect = Vector(
                    circ.x - this.x,
                    circ.y - this.y
                );
                return vect.magnitude < this.radius + circ.radius;
            }
        }
    }).extend({
        radius: rad || 0,
        draw: function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.strokeStyle = 'rgba(250, 50, 50, 0.5)';
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
            ctx.stroke();
        }
    });
};
