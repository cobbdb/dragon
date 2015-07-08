﻿var Particle = require('./base.js'),
    Obj = require('../util/object.js');

/**
 * @class SquareParticle
 * @extends Particle
 */
module.exports = function (owner, opts) {
    opts = Obj.mergeDefaults(opts, {
        name: 'dragon-particle-square'
    });
    return Particle(owner, opts).extend({
        draw: function (ctx) {
            this.base.draw(ctx);
            ctx.fillRect(
                -this.size().width / 2,
                -this.size().height / 2,
                this.size().width,
                this.size().height
            );
        }
    });
};
