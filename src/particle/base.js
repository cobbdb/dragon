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
 */
module.exports = function (owner, opts) {
    var conf = Util.mergeDefaults({
        pos: Point(10, 10)
    }, {
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

    return ClearSprite(conf).extend({
        rotSpeed: random() * 0.4 - 0.2,
        gravity: opts.gravity,
        update: function () {
            this.rotation += this.rotSpeed;
            this.rotation %= global.Math.PI * 2;
            this.speed.y += this.gravity;
            this.base.update();
            if (!this.onscreen()) {
                this.stop();
                owner.remove(this);
            }
        },
        predraw: function (ctx) {
            ctx.save();
            ctx.translate(
                100,//this.pos.x + this.size().width / 2,
                100//this.pos.y + this.size().height / 2
            );
            //ctx.rotate(this.rotation);
            //opts.style(ctx);
        },
        draw: function (ctx) {
            ctx.restore();
        }
    });
};
