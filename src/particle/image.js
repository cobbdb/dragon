var Particle = require('./base.js'),
    pipeline = require('../assets/pipeline.js');

/**
 * @class ImageParticle
 * @extends Particle
 * @param {String} opts.src
 */
module.exports = function (opts) {
    var img = pipeline.get.image(opts.src);
    opts.name = opts.name || '$:particle-image';

    return Particle(opts).extend({
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
