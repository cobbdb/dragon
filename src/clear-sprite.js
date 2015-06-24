var BaseClass = require('baseclassjs'),
    CollisionItem = require('./collision-item.js'),
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
 * @param {Point} [opts.speed] Defaults to (0,0).
 * @param {Boolean} [opts.freemask] Defaults to false. True
 * to decouple the position of the mask from the position
 * of the sprite.
 * @param {Boolean} [opts.drawing] Defaults to false.
 * @param {Boolean} [opts.updating] Defaults to false.
 */
module.exports = function (opts) {
    var pos = opts.pos || Point(),
        size = opts.size || Dimension();

    Util.mergeDefaults(opts, {
        name: 'dragon-sprite',
        kind: 'dragon-sprite',
        mask: Rectangle(),
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
        updating: opts.updating || false,
        drawing: opts.drawing || false,
        pos: pos,
        scale: opts.scale || 1,
        size: size,
        trueSize: function () {
            return this.size.scale(this.scale);
        },
        rotation: opts.rotation || 0,
        depth: opts.depth || 0,
        speed: opts.speed || Vector(),
        update: function () {
            if (this.updating) {
                if (!this.speed.is.zero) {
                    this.shift();
                }
                this.base.update();
            }
        },
        load: function (onload) {
            onload();
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
         * @param {Point|Vector} offset
         */
        shift: function (offset) {
            var target = this.pos.add(offset || this.speed);
            this.move(target);
        }
    });
};
