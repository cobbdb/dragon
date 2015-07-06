var ClearSprite = require('../clear-sprite.js'),
    Vector = require('../geom/vector.js'),
    Dimension = require('../geom/dimension.js'),
    Point = require('../geom/point.js'),
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
 * @param {Number} [opts.lifespan] Defaults to 5 seconds.
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
        lifespan: 5,
        style: function () {}
    });

    /**
     * Remove this Particle from the game.
     */
    function destroy() {
        this.stop();
        owner.remove(this);
    }

    return ClearSprite(opts).extend({
        _create: function () {
            // Kill this particle after a timeout.
            global.setTimeout(
                destroy.bind(this),
                opts.lifespan * 1000
            );
        },
        rotSpeed: random() * 0.4 - 0.2,
        gravity: opts.gravity,
        update: function () {
            this.rotation += this.rotSpeed;
            this.rotation %= global.Math.PI * 2;
            this.speed.y += this.gravity;
            this.base.update();
        },
        predraw: function (ctx) {
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
