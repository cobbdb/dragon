var Collidable = require('./collidable.js'),
    Point = require('./geom/point.js'),
    Vector = require('./geom/vector.js'),
    Dimension = require('./geom/dimension.js'),
    Rectangle = require('./geom/rectangle.js'),
    Num = require('./util/number.js');

/**
 * @class ClearSprite
 * @extends Collidable
 * @param {Point} [opts.pos] Defaults to (0,0).
 * @param {Number} [opts.scale] Defaults to 1.
 * @param {Dimension} [opts.size] Defaults to (0,0).
 * @param {Number} [opts.rotation] Defaults to 0.
 * @param {Vector} [opts.speed] Defaults to <0,0>.
 * @param {Boolean} [opts.freemask] Defaults to false. True
 * to decouple the position of the mask from the position
 * of the sprite.
 * @param {Number} [opts.alpha] Defaults to 1.
 * @param {Number} [opts.gravity] Defaults to 0. Amount to
 * increase vertical velocity each update.
 * @param {Number} [opts.friction] Defaults to 0. Amount to
 * reduce speed each update.
 * @param {Number} [opts.rotationSpeed] Defaults to 0.
 */
module.exports = function (opts) {
    var pos = opts.pos || Point(),
        size = opts.size || Dimension(),
        scale = opts.scale || 1,
        adjsize = size.clone().multiplyFixed(scale, scale);

    opts.name = opts.name || '$:clear-sprite';
    opts.kind = opts.kind || '$:clear-sprite';
    opts.mask = opts.mask || Rectangle();

    if (!opts.freemask) {
        // Setup mask offset.
        opts.offset = opts.mask.pos();
        opts.mask.moveFixed(
            pos.x + opts.offset.x,
            pos.y + opts.offset.y
        );
        // Use entire sprite size if no mask size defined.
        if (!opts.mask.width && !opts.mask.height) {
            opts.mask.resize(adjsize);
        }
    }

    return Collidable(opts).extend({
        gravity: opts.gravity || 0,
        friction: opts.friction || 0,
        pos: pos,
        alpha: opts.alpha || 1,
        /**
         * @param {Number} [newscale]
         * @return {Number}
         */
        scale: function (newval) {
            if (newval) {
                scale = newval;
                adjsize.width = size.width * scale;
                adjsize.height = size.height * scale;
                adjsize.floor();
                if (!opts.freemask) {
                    this.mask.resize(adjsize);
                }
            } else {
                return scale;
            }
        },
        /**
         * @param {Dimension} [newsize]
         * @return {Dimension}
         */
        size: function (newsize) {
            if (newsize) {
                size.set(newsize);
                adjsize.width = size.width * scale;
                adjsize.height = size.height * scale;
                adjsize.floor();
                if (!opts.freemask) {
                    this.mask.resize(adjsize);
                }
            } else {
                return adjsize;
            }
        },
        rotation: opts.rotation || 0,
        rotationSpeed: opts.rotationSpeed || 0,
        speed: opts.speed || Vector(),
        update: function () {
            this.rotationSpeed *= 1 - this.friction;
            this.rotation += this.rotationSpeed;
            this.rotation %= Num.PI2;

            this.speed.y += this.gravity;

            if (!this.speed.isZero()) {
                this.speed.x *= 1 - this.friction;
                this.speed.y *= 1 - this.friction;
                this.shift();
            }
            this.base.update();
        },
        draw: function (ctx) {
            var sin = Num.sin(this.rotation),
                cos = Num.cos(this.rotation);

            ctx.globalAlpha = this.alpha;
            ctx.setTransform(
                cos, sin, -sin, cos,
                this.pos.x, this.pos.y
            );
            ctx.moveTo(adjsize.width, 0);
        },
        /**
         * Move the Sprite and its mask unless freemask.
         * @param {Point} pos
         */
        move: function (pos) {
            this.moveFixed(
                pos.x,
                pos.y
            );
        },
        /**
         * Move the Sprite and its mask unless freemask.
         * @param {Number} x
         * @param {Number} y
         */
        moveFixed: function (x, y) {
            this.pos.moveFixed(x, y);
            if (!opts.freemask) {
                this.base.moveFixed(x, y);
            }
        },
        /**
         * @param {Vector} [offset]
         */
        shift: function (offset) {
            offset = offset || this.speed;

            this.moveFixed(
                this.pos.x + offset.x,
                this.pos.y + offset.y
            );
        },
        /**
         * @param {Number} [x]
         * @param {Number} [y]
         */
        shiftFixed: function (x, y) {
            var shiftx = x || this.speed.x,
                shifty = y || this.speed.y;

            this.moveFixed(
                this.pos.x + shiftx,
                this.pos.y + shifty
            );
        }
    });
};
