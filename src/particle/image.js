var Particle = require('./base.js'),
    Obj = require('../util/object.js'),
    pipeline = require('../assets/pipeline.js');

/**
 * @class ImageParticle
 * @extends Particle
 * @param {String} opts.src
 */
module.exports = function (owner, opts) {
    var img = pipeline.get.image(opts.src);

    opts = Obj.mergeDefaults(opts, {
        name: 'dragon-particle-image'
    });

    return Particle(owner, opts).extend({
        draw: function (ctx) {
            this.base.draw(ctx);
            ctx.drawImage(img,
                -this.size().width / 2,
                -this.size().height / 2,
                this.size().width,
                this.size().height
            );
        }
    });
};
