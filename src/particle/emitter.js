var BaseClass = require('baseclassjs'),
    Collection = require('../collection.js'),
    Point = require('../geom/point.js'),
    canvas = require('../io/canvas.js'),
    timer = require('../util/timer.js'),
    cnt = 0,
    volume = 0;

// Activate a particle if possible.
// This is external to the emitter for ~1.5-2x speed boost.
function activate(particle) {
    if (!particle.updating && cnt < volume) {
        cnt += 1
        particle.start();
    }
}

/**
 * @class ParticleEmitter
 * @extends Collection
 * Generates a fountain of particles at a given location.
 * @param {ParticleConstructor} opts.type Constructor to
 * use when spawning Particles.
 * @param {Number} [opts.volume] Defaults to 4. Number
 * of Particles to spawn per step.
 * @param {Number} [opts.speed] Defaults to 250. Milliseconds
 * between each step.
 * @param {Function} [opts.style] Special canvas setup to
 * perform before drawing.
 * @param {Function} [opts.conf] Returns particle options.
 */
module.exports = function (opts) {
    var hash;

    opts.sorted = false;
    opts.name = opts.name || '$:emitter';
    opts.kind = opts.kind || '$:emitter';
    opts.pos = opts.pos || Point();
    opts.speed = opts.speed || 250;
    opts.volume = opts.volume || 4;
    opts.style = opts.style || BaseClass.Stub;
    opts.conf = opts.conf || BaseClass.Stub;

    return Collection(opts).extend({
        speed: opts.speed,
        volume: opts.volume,
        _create: function () {
            var i, particle, conf;

            // Generate a pool of 50 particles to use.
            for (i = 0; i < 50; i += 1) {
                conf = opts.conf() || {};
                conf.origin = this.pos;
                conf.pos = conf.pos || opts.pos.clone();
                particle = opts.type(conf);
                this.set.push(particle);
            }

            // Only repeat if a non-zero speed was set.
            if (this.speed) {
                hash = timer.setInterval(this.fire, this.speed, this);
            }
        },
        /**
         * Activate a heartbeat of particles.
         */
        fire: function () {
            cnt = 0;
            volume = this.volume;
            this.set.map(activate);
        },
        draw: function (ctx) {
            opts.style.call(this, ctx);
            this.base.draw(ctx);
        },
        /**
         * Stop continuous spawn if possible.
         */
        kill: function () {
            timer.clear(hash);
        },
        pos: opts.pos,
        move: function (newpos) {
            var i, len = this.set.length;

            this.pos = newpos;
            for (i = 0; i < len; i += 1) {
                this.set[i].reset(newpos);
            }
        },
        teardown: function () {}
    });
};
