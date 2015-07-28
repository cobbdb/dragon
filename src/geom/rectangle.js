var Point = require('./point.js'),
    Dimension = require('./dimension.js');

/**
 * @param {Point} [pos] Defaults to (0,0).
 * @param {Dimension} [size] Defaults to (0,0).
 */
module.exports = function (pos, size) {
    pos = pos || Point();
    size = size || Dimension();

    return {
        name: '$:Rectangle',
        kind: '$:Shape',
        intersects: function (other) {
            return (
                this.x < other.right &&
                this.right > other.x &&
                this.y < other.bottom &&
                this.bottom > other.y
            );
        },
        x: pos.x,
        y: pos.y,
        width: size.width,
        height: size.height,
        top: pos.y,
        right: pos.x + size.width,
        bottom: pos.y + size.height,
        left: pos.x,
        center: Point(
            pos.x + size.width / 2,
            pos.y + size.height / 2
        ),
        pos: function () {
            return Point(this.x, this.y);
        },
        /**
         * @param {Point} pos
         */
        move: function (pos) {
            this.moveFixed(pos.x, pos.y);
        },
        /**
         * @param {Number} x
         * @param {Number} y
         */
        moveFixed: function (x, y) {
            this.x = x;
            this.y = y;
            this.top = y;
            this.right = x + this.width;
            this.bottom = y + this.height;
            this.left = x;
            this.center.x = x + this.width / 2;
            this.center.y = y + this.height / 2;
        },
        /**
         * @param {Point|Vector} offset
         */
        shift: function (offset) {
            this.moveFixed(
                this.x + offset.x,
                this.y + offset.y
            );
        },
        /**
         * @param {Number} x
         * @param {Number} y
         */
        shiftFixed: function (x, y) {
            this.moveFixed(
                this.x + x,
                this.y + y
            );
        },
        /**
         * @param {Dimension} size
         */
        resize: function (size) {
            this.resizeFixed(size.width, size.height);
        },
        /**
         * @param {Number} w
         * @param {Number} h
         */
        resizeFixed: function (w, h) {
            this.width = w;
            this.height = h;
            this.right = this.x + w;
            this.bottom = this.y + h;
            this.center.x = this.x + w / 2;
            this.center.y = this.y + h / 2;
        },
        draw: function (ctx) {
            ctx.beginPath();
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            ctx.strokeStyle = '#f55';
            ctx.rect(this.x, this.y, this.width, this.height);
            ctx.stroke();
        }
    };
};
