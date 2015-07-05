var Particle = require('./base.js');

/**
 * @class Square
 * @extends Particle
 */
module.exports = function (owner, opts) {
    return Particle(owner, opts).extend({
        draw: function (ctx) {
            this.predraw(ctx);
            ctx.fillStyle = '#333';
            ctx.fillRect(
                -this.size().width / 2,
                -this.size().height / 2,
                this.size().width,
                this.size().height
            );
            this.base.draw(ctx);
        }
    });
};
