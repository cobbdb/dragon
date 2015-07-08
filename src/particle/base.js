var ClearSprite = require('../clear-sprite.js'),
    Vector = require('../geom/vector.js'),
    Dimension = require('../geom/dimension.js'),
    Point = require('../geom/point.js'),
    canvas = require('../io/canvas.js'),
    random = require('../util/random.js'),
    Obj = require('../util/object.js'),
    Num = require('../util/number.js'),
    timer = require('../util/timer.js');

/**
 * @class Particle
 * @extends ClearSprite
 * Basic abstract contract for all particle types.
 * @param {Emitter} owner
 * @param {Number} [opts.lifespan] Defaults to 1000.
 * @param {Number} [opts.gravity] Defaults to 0.
 * @param {Dimension} [opts.size] Defaults to (10,10).
 */
module.exports = function (owner, opts) {
    var fadeout = false,
        startPos = opts.pos,
        startSpeed = Vector(
            random() - 0.5,
            random() - 0.5
        );

    opts = Obj.mergeDefaults(opts, {
        name: 'dragon-particle',
        kind: 'dragon-particle',
        size: Dimension(4, 4),
        rotSpeed: random() * 0.4 - 0.2,
        gravity: 0,
        speed: startSpeed.clone(),
        lifespan: 1000,
        on: {}
    });
    opts.lifespan += random() * 250;
    opts.on.$added = function () {
        // Kill this particle after a timeout.
        timer.setTimeout(function () {
            fadeout = true;
        }, opts.lifespan);
    };

    return ClearSprite(opts).extend({
        reset: function () {
            fadeout = false;
            this.alpha = 1;
            this.rotation = 0;
            this.move(startPos);
            this.speed = startSpeed.clone();
        },
        rotSpeed: opts.rotSpeed,
        gravity: opts.gravity,
        update: function () {
            if (this.alpha > 0) {
                if (fadeout) {
                    this.alpha -= 0.05;
                    this.alpha = global.Math.max(0, this.alpha);
                }
                this.rotation += this.rotSpeed;
                this.rotation %= Num.PI2;
                this.speed.y += this.gravity;
            } else {
                owner.reclaim(this);
            }
            this.base.update();
        },
        draw: function (ctx) {
            var sin = Num.sin(this.rotation),
                cos = Num.cos(this.rotation);
            this.base.draw(ctx);
            ctx.setTransform(
                cos, sin, -sin, cos,
                this.pos.x, this.pos.y
            );
            ctx.moveTo(this.size().width, 0);
        }
    });
};
