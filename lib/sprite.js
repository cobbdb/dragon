var BaseClass = require('baseclassjs'),
    Point = require('./point.js');

/**
 * @param opts.strip Animation strip
 * @param opts.pos.x, opts.pos.y
 * @param opts.src.x, opts.src.y
 * @param opts.size.width, opts.size.height
 * @param opts.mask
 */
module.exports = function (opts) {
    return {
        extend: BaseClass,
        pos: opts.pos || Point(),
        speed: opts.speed || Point(),
        update: BaseClass.Stub,
        draw: function (ctx) {
            opts.strip.draw(ctx, this.pos.x, this.pos.y);
        },
        mask: opts.mask,
        move: function (x, y) {
            this.pos.x = x;
            this.pos.y = y;
            opts.mask.move(x, y);
        },
        shift: function (vx, vy) {
            this.pos.x += vx || this.speed.x;
            this.pox.y += vy || this.speed.y;
            opts.mask.move(this.pos.x, this.pos.y);
        },
        collidesWith: function (other) {
            return opts.mask.collidesWith(other.mask);
        },
        collide: BaseClass.Abstract
    };
};
