var ClearSprite = require('../clear-sprite.js'),
    Vector = require('../geom/vector.js'),
    Dimension = require('../geom/dimension.js'),
    Point = require('../geom/point.js'),
    random = require('../util/random.js'),
    Obj = require('../util/object.js'),
    timer = require('../util/timer.js');

/**
 * @class Particle
 * @extends ClearSprite
 * Basic abstract contract for all particle types.
 * @param {Emitter} opts.owner
 * @param {Number} [opts.lifespan] Defaults to 1000.
 * @param {Dimension} [opts.size] Defaults to (4,4).
 * @param {Function} [opts.style] Special canvas setup to
 * perform before drawing.
 * @param {Number} [opts.fade] Defaults to 0.05. Speed of
 * fadeout.
 */
module.exports = function (opts) {
    var fadeout = false,
        hash,
        startSpeed;

    opts = Obj.mergeDefaults(opts, {
        name: '$:particle',
        kind: '$:particle',
        size: Dimension(4, 4),
        rotationSpeed: random() * 0.4 - 0.2,
        speed: Vector(
            random() - 0.5,
            random() - 0.5
        ),
        lifespan: 1000,
        style: function () {},
        fade: 0.05
    });
    startSpeed = opts.speed.clone();
    opts.lifespan += random() * 250;

    return ClearSprite(opts).extend({
        _create: function () {
            this.stop();
        },
        /**
         * @param {Point} origin
         */
        reset: function (origin) {
            this.stop();
            timer.clear(hash);
            fadeout = false;

            this.alpha = 1;
            this.rotation = 0;
            this.rotationSpeed = opts.rotationSpeed;
            this.move(origin);
            this.speed = startSpeed.clone();
        },
        start: function () {
            this.base.start();
            hash = timer.setTimeout(function () {
                fadeout = true;
            }, opts.lifespan);
        },
        update: function () {
            if (fadeout) {
                this.alpha -= opts.fade;
            }
            if (this.alpha < 0) {
                opts.owner.reclaim(this);
            }
            this.base.update();
        },
        draw: function (ctx) {
            this.base.draw(ctx);
            opts.style(ctx);
        }
    });
};
