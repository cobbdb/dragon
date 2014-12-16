var Collidable = require('./collidable.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js');

/**
 * ##### Sprite
 * @param {AnimationStrip} opts.strip
 * @param {Point} [opts.pos] Defaults to (0,0).
 * @param {Number} [opts.scale] Defaults to 1.
 * @param {Dimension} [opts.size] Defaults to strip size.
 * @param {Number} [opts.depth] Defaults to 0.
 * @param {Number} [opts.rotation] Defaults to 0.
 * @param {Point} [opts.speed] Defaults to (0,0).
 *
 * ##### Collidable
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} opts.name
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {Object} [opts.on] Dictionary of events.
 * @param {Object} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var size = opts.size || opts.strip.size,
        stripSize = opts.strip.size;

    return Collidable(opts).extend({
        ready: function () {
            return opts.strip.ready();
        },
        strip: opts.strip,
        pos: opts.pos || Point(),
        scale: opts.scale || 1,
        size: size,
        rotation: opts.rotation || 0,
        depth: opts.depth || 0,
        speed: opts.speed || Point(),
        update: function (base) {
            // Update position if moving.
            this.shift();
            base.update();
            // Advance the animation.
            opts.strip.update();
        },
        draw: function (ctx) {
            opts.strip.draw(
                ctx,
                this.pos,
                Dimension(
                    this.scale * this.size.width / stripSize.width,
                    this.scale * this.size.height / stripSize.height
                ),
                this.rotation
            );
        },
        move: function (x, y, base) {
            this.pos.x = x;
            this.pos.y = y;
            base.move(x, y);
        },
        shift: function (base) {
            this.pos.x += this.speed.x;
            this.pos.y += this.speed.y;
            base.move(this.pos.x, this.pos.y);
        }
    });
};
