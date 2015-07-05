var ClearSprite = require('../clear-sprite.js'),
    Vector = require('../geom/vector.js'),
    Dimension = require('../geom/dimension.js'),
    canvas = require('../io/canvas.js'),
    random = require('../util/random.js'),
    Util = require('../util/object.js');

/**
 * @class Particle
 * @extends ClearSprite
 * Basic abstract contract for all particle types.
 * @param {Emitter} owner
 * @param {Number} [opts.gravity] Defaults to 0.
 * @param {Function} [opts.style] Special canvas setup to
 * perform before drawing.
 * @param {Dimension} [opts.size] Defaults to (10,10).
 */
module.exports = function (owner, opts) {
    opts = Util.mergeDefaults(opts, {
        name: 'dragon-particle',
        kind: 'dragon-particle',
        speed: Vector(
            random() * 4 - 2,
            random() * 4 - 2
        ),
        size: Dimension(10, 10),
        gravity: 0,
        style: function () {}
    });

    return ClearSprite(opts).extend({
        rotSpeed: random() * 2 - 1,
        gravity: opts.gravity,
        update: function () {
            this.rotation += this.rotSpeed;
            this.rotation %= 6.283;
            this.speed.y += this.gravity;
            this.base.update();
            if (!this.onscreen()) {
                this.stop();
                owner.remove(this);
            }
        },
        predraw: function (ctx) {
            ctx.save();
            ctx.rotate(this.rotation);
            opts.style(ctx);
        },
        draw: function (ctx) {
            ctx.restore();
        }
    });
};
