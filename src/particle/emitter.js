var BaseClass = require('baseclassjs'),
    Collection = require('../collection.js'),
    Point = require('../geom/point.js'),
    canvas = require('../io/canvas.js'),
    timer = require('../util/timer.js');

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
    var hash,
        bank = [];

    opts.name = opts.name || '$:emitter';
    opts.kind = opts.kind || '$:emitter';
    opts.pos = opts.pos || Point(); // <-- Garbage
    opts.speed = opts.speed || 250;
    opts.volume = opts.volume || 4;
    opts.style = opts.style || BaseClass.Stub;
    opts.conf = opts.conf || BaseClass.Stub;

    return Collection(opts).extend({
        sorted: false,
        speed: opts.speed,
        volume: opts.volume,
        _create: function () {
            var i, particle, conf;

            // Generate a pool of 50 particles to use.
            for (i = 0; i < 50; i += 1) {
                conf = opts.conf() || {}; // <-- Garbage
                conf.owner = this;
                conf.pos = conf.pos || opts.pos.clone(); // <-- Garbage
                particle = opts.type(conf);
                bank.push(particle);
                this.set.push(particle);
            }

            // Only repeat if a non-zero speed was set.
            if (this.speed) {
                hash = timer.setInterval(function () {
                    this.fire();
                }, this.speed, this);
            }
        },
        /**
         * Activate a heartbeat of particles.
         */
        fire: function () {
            var set = bank.splice(0, this.volume),
                i, len = set.length;
            for (i = 0; i < len; i += 1) {
                set[i].start();
            }
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
        /**
         * Reset a particle and add it back to the bank.
         * @param {Particle} particle
         */
        reclaim: function (particle) {
            particle.reset(this.pos);
            bank.push(particle);
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
