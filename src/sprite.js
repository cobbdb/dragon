var Collidable = require('./collidable.js'),
    Point = require('./point.js');

/**
 * Sprite:
 * @param opts.strip AnimationStrip
 * @param opts.pos Point
 * @param opts.scale
 * @param opts.depth
 * @param opts.rotation
 * @param opts.speed
 *
 * Collidable:
 * @param opts.mask
 * @param opts.name
 * @param opts.collisionSets Array
 */
module.exports = function (opts) {
    return Collidable(opts).extend({
        get ready () {
            return opts.strip.ready;
        },
        get strip () {
            return opts.strip;
        },
        pos: opts.pos || Point(),
        scale: opts.scale || 1,
        rotation: opts.rotation || 0,
        depth: opts.depth || 0,
        speed: opts.speed || Point(),
        // Advance the animation.
        update: function () {
            this.base.update();
            // Update the graphics.
            opts.strip.update();
        },
        draw: function (ctx) {
            opts.strip.draw(ctx,
                this.pos, this.scale, this.rotation
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
