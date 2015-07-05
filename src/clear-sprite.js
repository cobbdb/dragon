var CollisionItem = require('./collision-item.js'),
    Point = require('./geom/point.js'),
    Vector = require('./geom/vector.js'),
    Dimension = require('./geom/dimension.js'),
    Rectangle = require('./geom/rectangle.js'),
    Util = require('./util/object.js');

/**
 * @class ClearSprite
 * @extends CollisionItem
 * @param {Point} [opts.pos] Defaults to (0,0).
 * @param {Number} [opts.scale] Defaults to 1.
 * @param {Dimension} [opts.size] Defaults to strip size.
 * @param {Number} [opts.depth] Defaults to 0.
 * @param {Number} [opts.rotation] Defaults to 0.
 * @param {Vector} [opts.speed] Defaults to <0,0>.
 * @param {Boolean} [opts.freemask] Defaults to false. True
 * to decouple the position of the mask from the position
 * of the sprite.
 * @param {Boolean} [opts.drawing] Defaults to false.
 * @param {Boolean} [opts.updating] Defaults to false.
 */
module.exports = function (opts) {
    var pos = opts.pos || Point(),
        size = opts.size || Dimension(),
        scale = opts.scale || 1,
        adjsize = size.multiply(Dimension(scale, scale));

    opts = Util.mergeDefaults(opts, {
        name: 'dragon-clear-sprite',
        kind: 'dragon-clear-sprite',
        mask: Rectangle(),
        updating: false,
        drawing: false,
        one: {}
    });
    opts.one.ready = opts.one.ready || function () {
        this.start();
    };

    if (!opts.freemask) {
        // Setup mask offset.
        opts.offset = opts.mask.pos();
        opts.mask.move(
            pos.add(opts.offset)
        );
        // Use entire sprite size if no mask size defined.
        if (!opts.mask.width && !opts.mask.height) {
            opts.mask.resize(size);
        }
    }

    return CollisionItem(opts).extend({
        pos: pos,
        scale: function (newval) {
            if (newval) {
                scale = newval;
                adjsize = size.multiply(Dimension(scale, scale));
                if (!opts.freemask) {
                    this.mask.resize(adjsize);
                }
            } else {
                return scale;
            }
        },
        size: function (newval) {
            if (newval) {
                size = newval;
                adjsize = size.multiply(Dimension(scale, scale));
                if (!opts.freemask) {
                    this.mask.resize(adjsize);
                }
            } else {
                return adjsize;
            }
        },
        rotation: opts.rotation || 0,
        speed: opts.speed || Vector(),
        update: function () {
            if (!this.speed.is.zero) {
                this.shift();
            }
            this.base.update();
        },
        /**
         * Move the Sprite and its mask unless freemask.
         * @param {Point} pos
         */
        move: function (pos) {
            this.pos.move(pos, true);
            if (!opts.freemask) {
                this.base.move(this.pos);
            }
        },
        /**
         * @param {Vector} offset
         */
        shift: function (offset) {
            var target = this.pos.add(offset || this.speed);
            this.move(target);
        }
    });
};
