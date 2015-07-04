var Particle = require('./base.js');

/**
 * @class Square
 * @extends Particle
 */
module.exports = function (opts) {
    return Particle(opts).extend({
        draw: function (ctx) {
            ctx.save();
            this.base.setupDraw(ctx);

            ctx.fillRect(
                this.pos.x,
                this.pos.y,
                this.size().width,
                this.size().height
            );
            ctx.restore();
        }
    });
};
