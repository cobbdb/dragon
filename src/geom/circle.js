var Shape = require('./shape.js'),
    Vector = require('./vector.js'),
    Point = require('./point.js'),
    Num = require('../util/number.js');

/**
 * @deprecated
 * Circles are deprecated until replacement
 * for sqrt can be found.
 *
 * @param {Point} [pos] Defaults to (0,0).
 * @param {Number} [rad] Defaults to 0.
 */
module.exports = function (pos, rad) {
    pos = pos || Point();
    rad = rad || 0;

    return Shape({
        pos: pos,
        name: 'circle',
        intersects: {
            rectangle: function (rect) {
                var vect,
                    pt = Point(this.x, this.y); // <-- Garbage

                if (this.x >= rect.right) pt.x = rect.right;
                else if (this.x <= rect.x) pt.x = rect.x;
                if (this.y >= rect.bottom) pt.y = rect.bottom;
                else if (this.y <= rect.y) pt.y = rect.y;

                vect = Vector( // <-- Garbage
                    this.x - pt.x,
                    this.y - pt.y
                );
                return vect.magnitude < this.radius;
            },
            /**
             * @slow
             * Do not use until find sqrt replacement.
             */
            circle: function (circ) {
                throw Error('!! CIRCLES are deprecated!');
                var vect = Vector( // <-- Garbage
                    circ.x - this.x,
                    circ.y - this.y
                );
                return vect.magnitude < this.radius + circ.radius;
            }
        }
    }).extend({
        radius: rad,
        width: rad * 2,
        height: rad * 2,
        top: pos.y - rad,
        right: pos.x + rad,
        bottom: pos.y + rad,
        left: pos.x - rad,
        center: function () {
            return Point(this.x, this.y);
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#f55';
            ctx.arc(this.x, this.y, this.radius, 0, 2 * Num.PI);
            ctx.stroke();
        },
        /**
         * @param {Point} pos
         */
        move: function (pos) {
            this.x = pos.x;
            this.y = pos.y;
            this.top = pos.y - this.radius;
            this.right = pos.x + this.radius;
            this.bottom = pos.y + this.radius;
            this.left = pos.x - this.radius;
        },
        /**
         * @param {Dimension} size
         */
        resize: function (size) {
            var rad = global.Math.max(size.width, size.height);
            this.radius = rad;
            this.width = rad * 2;
            this.height = rad * 2;
            this.top = this.y - rad;
            this.right = this.x + rad;
            this.bottom = this.y + rad;
            this.left = this.x - rad;
        }
    });
};
