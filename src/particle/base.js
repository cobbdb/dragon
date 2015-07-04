var ClearSprite = require('../clear-sprite.js'),
    Vector = require('../geom/vector.js'),
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
 */
module.exports = function (owner, opts) {
    opts = Util.mergeDefaults(opts, {
        speed: Vector(
            random() * 4 - 2,
            random() * 4 - 2
        ),
        gravity: 0,
        style: function () {}
    });

    return ClearSprite(opts).extend({
        rotSpeed: random() * 2 - 1,
        gravity: opts.gravity,
        update: function () {
            this.rotation += this.rotSpeed;
            this.speed.y += this.gravity;
            this.base.update();
            if (!this.onscreen()) {
                this.stop();
                owner.remove(this);
            }
        },
        setupDraw: function (ctx) {
            ctx.save();
            ctx.translate(
                this.pos.x + this.size().width / 2,
                this.pos.y + this.size().height / 2
            );
            ctx.rotate(this.rotation);
            opts.style(ctx);
        },
        draw: function (ctx) {
            ctx.restore();
        }
    });
};
