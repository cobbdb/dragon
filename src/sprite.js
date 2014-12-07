var Collidable = require('./collidable.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js');

/**
 * Sprite:
 * @param {AnimationStrip} opts.strip
 * @param {Point} [opts.pos] Defaults to (0,0).
 * @param {Number} [opts.scale] Defaults to 1.
 * @param {Dimension} [opts.size] Defaults to strip size.
 * @param {Number} [opts.depth] Defaults to 0.
 * @param {Number} [opts.rotation] Defaults to 0.
 * @param {Point} [opts.speed] Defaults to (0,0).
 *
 * Collidable:
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} opts.name
 * @param {Array|CollisionHandler} [opts.collisionSets]
 */
module.exports = function (opts) {
    var size = opts.size || opts.strip.size;

    return Collidable(opts).extend({
        get ready () {
            return opts.strip.ready;
        },
        get strip () {
            return opts.strip;
        },
        pos: opts.pos || Point(),
        scale: opts.scale || 1,
        size: size,
        rotation: opts.rotation || 0,
        depth: opts.depth || 0,
        speed: opts.speed || Point(),
        update: function () {
            this.base.update();
            // Advance the animation.
            opts.strip.update();
        },
        draw: function (ctx) {
            opts.strip.draw(
                ctx,
                this.pos,
                Dimension(
                    size.width / opts.strip.size.width * this.scale,
                    size.height / opts.strip.size.height * this.scale
                ),
                this.rotation
            );
        },
        move: function (x, y) {
            this.pos.x = x;
            this.pos.y = y;
            this.base.move(x, y);
        },
        shift: function (vx, vy) {
            this.pos.x += vx || this.speed.x;
            this.pox.y += vy || this.speed.y;
            this.base.move(this.pos.x, this.pos.y);
        }
    });
};
