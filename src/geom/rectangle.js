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

    return Shape({
        pos: pos,
        name: 'rectangle',
        intersects: {
            rectangle: function (rect) {
                return (
                    this.x < rect.right &&
                    this.right > rect.x &&
                    this.y < rect.bottom &&
                    this.bottom > rect.y
                );
            },
            /**
             * @deprecated
             * Do not use until find sqrt replacement.
             */
            circle: function (circ) {
                throw Error('!! CIRCLES are deprecated!');
                var vect,
                    pt = Point(circ.x, circ.y); // <-- Garbage

                if (circ.x > this.right) pt.x = this.right;
                else if (circ.x < this.x) pt.x = this.x;
                if (circ.y > this.bottom) pt.y = this.bottom;
                else if (circ.y < this.y) pt.y = this.y;

                vect = Vector( // <-- Garbage
                    circ.x - pt.x,
                    circ.y - pt.y
                );
                return vect.magnitude < circ.radius;
            }
        }
    }).extend({
        width: size.width || 0,
        height: size.height || 0,
        top: pos.y || 0,
        right: pos.x + size.width || 0,
        bottom: pos.y + size.height || 0,
        left: pos.x || 0,
        center: function () {
            return Point(
                this.x + this.width / 2,
                this.y + this.height / 2
            );
        },
        /**
         * @param {Point} pos
         */
        move: function (pos) {
            this.x = pos.x;
            this.y = pos.y;
            this.top = pos.y;
            this.right = pos.x + this.width;
            this.bottom = pos.y + this.height;
            this.left = pos.x;
        },
        /**
         * @param {Point} offset
         */
        shift: function (offset) {
            this.move(
                this.pos().add(offset) // <-- Garbage
            );
        },
        /**
         * @param {Dimension} size
         */
        resize: function (size) {
            this.width = size.width;
            this.height = size.height;
            this.right = this.x + size.width;
            this.bottom = this.y + size.height;
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#f55';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    });
};
