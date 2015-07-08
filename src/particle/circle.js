var Particle = require('./base.js'),
    Obj = require('../util/object.js'),
    Num = require('../util/number.js');

/**
 * @class CircleParticle
 * @extends Particle
 */
module.exports = function (owner, opts) {
    opts = Obj.mergeDefaults(opts, {
        name: 'dragon-particle-circle'
    });
    opts.rotSpeed = 0;
    return Particle(owner, opts).extend({
        draw: function (ctx) {
            this.base.draw(ctx);
            ctx.arc(
                0, 0,
                this.size().width / 2,
                0, Num.PI2
            );
        }
    });
};
