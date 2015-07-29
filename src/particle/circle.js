var Particle = require('./base.js'),
    Num = require('../util/number.js');

/**
 * @class CircleParticle
 * @extends Particle
 */
module.exports = function (opts) {
    opts = opts || {};
    opts.name = opts.name || '$:particle-circle';
    opts.rotationSpeed = 0;

    return Particle(opts).extend({
        draw: function (ctx) {
            this.base.draw(ctx);
            ctx.beginPath();
            ctx.arc(
                0, 0,
                this.size().width / 2,
                0, Num.PI2
            );
            ctx.fill();
        }
    });
};
