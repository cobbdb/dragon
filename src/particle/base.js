var ClearSprite = require('../clear-sprite.js'),
    Vector = require('../geom/vector.js'),
    Dimension = require('../geom/dimension.js'),
    Point = require('../geom/point.js'),
    canvas = require('../io/canvas.js'),
    random = require('../util/random.js'),
    Util = require('../util/object.js'),
    timer = require('../util/timer.js');

/**
 * @class Particle
 * @extends ClearSprite
 * Basic abstract contract for all particle types.
 * @param {Emitter} owner
 * @param {Number} [opts.lifespan] Defaults to 1000.
 * @param {Number} [opts.gravity] Defaults to 0.
 * @param {Function} [opts.style] Special canvas setup to
 * perform before drawing.
 * @param {Dimension} [opts.size] Defaults to (10,10).
 */
module.exports = function (owner, opts) {
    var fadeout = false,
        homePos = opts.pos;

    opts = Util.mergeDefaults(opts, {
        name: 'dragon-particle',
        kind: 'dragon-particle',
        speed: Vector(
            random() - 0.5,
            random() - 0.5
        ),
        size: Dimension(10, 10),
        gravity: 0,
        lifespan: 1000,
        style: function () {},
        on: {}
    });
    opts.lifespan += random() * 150;
    opts.on.ready = function () {
        this.start();
    };

    return ClearSprite(opts).extend({
        _create: function () {
            this.stop();

            // Kill this particle after a timeout.
            timer.setTimeout(function () {
                fadeout = true;
            }, opts.lifespan);
        },
        reset: function () {
            this.stop();
            fadeout = false;
            this.alpha = 1;
            this.rotation = 0;
            this.move(homePos);
        },
        rotSpeed: random() * 0.4 - 0.2,
        gravity: opts.gravity,
        update: function () {
            if (this.alpha > 0) {
                if (fadeout) {
                    this.alpha -= 0.05;
                    this.alpha = global.Math.max(0, this.alpha);
                }
                this.rotation += this.rotSpeed;
                this.rotation %= global.Math.PI * 2;
                this.speed.y += this.gravity;
            } else {
                owner.reclaim(this);
            }
            this.base.update();
        },
        predraw: function (ctx) {
            this.base.draw(ctx);
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
