﻿var ClearSprite = require('../clear-sprite.js'),
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
 * @param {Number} [opts.gravity] Defaults to 0.
 * @param {Function} [opts.style] Special canvas setup to
 * perform before drawing.
 * @param {Dimension} [opts.size] Defaults to (10,10).
 * @param {Number} [opts.lifespan] Defaults to 2000.
 */
module.exports = function (owner, opts) {
    var doFade = false,

    opts = Util.mergeDefaults(opts, {
        name: 'dragon-particle',
        kind: 'dragon-particle',
        speed: Vector(
            random() - 0.5,
            random() - 0.5
        ),
        size: Dimension(10, 10),
        gravity: 0,
        lifespan: 2000,
        style: function () {}
    });
    opts.lifespan += random() * 150;

    return ClearSprite(opts).extend({
        _create: function () {
            // Kill this particle after a timeout.
            timer.setTimeout(function () {
                doFade = true;
            }, opts.lifespan);
        },
        rotSpeed: random() * 0.4 - 0.2,
        gravity: opts.gravity,
        update: function () {
            if (this.alpha > 0) {
                if (doFade) {
                    this.alpha -= 0.03;
                    this.alpha = global.Math.max(0, this.alpha);
                }
                this.rotation += this.rotSpeed;
                this.rotation %= global.Math.PI * 2;
                this.speed.y += this.gravity;
                this.base.update();
            } else {
                this.stop();
                owner.remove(this);
            }
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
