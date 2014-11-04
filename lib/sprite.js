var Collidable = require('./collidable.js'),
    Point = require('./point.js');

/**
 * @param opts.strip Animation strip
 * @param opts.pos.x, opts.pos.y
 * @param opts.src.x, opts.src.y
 * @param opts.size.width, opts.size.height
 * @param opts.mask
 * @param opts.name
 * @param opts.collisionSets Array
 */
module.exports = function (opts) {
    // --> When does opts.strip.start() get called?
    //     --> Where does the game start? Probably there

    return Collidable(opts).extend({
        pos: opts.pos || Point(),
        scale: 1,
        rotation: 0,
        depth: 0,
        speed: opts.speed || Point(),
        // Advance the animation.
        update: function () {
            this.base.update();
            // Update the graphics.
            opts.strip.update();
        },
        draw: function (ctx) {
            opts.strip.draw(ctx,
                this.pos.x, this.pos.y,
                this.scale, this.rotation
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
