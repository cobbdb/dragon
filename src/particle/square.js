var Particle = require('./base.js'),
    Obj = require('../util/object.js');

/**
 * @class SquareParticle
 * @extends Particle
 */
module.exports = function (opts) {
    opts = Obj.mergeDefaults(opts, {
        name: '$:particle-square'
    });
    return Particle(opts).extend({
        draw: function (ctx) {
            this.base.draw(ctx);
            ctx.beginPath();
            ctx.rect(
                -this.size().width / 2,
                -this.size().height / 2,
                this.size().width,
                this.size().height
            );
            ctx.fill();
        }
    });
};
