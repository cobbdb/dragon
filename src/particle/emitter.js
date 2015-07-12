var Collection = require('../collection.js'),
    Point = require('../geom/point.js'),
    Obj = require('../util/object.js'),
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

    opts = Obj.mergeDefaults(opts, {
        name: '$:emitter',
        kind: '$:emitter',
        pos: Point(),
        speed: 250,
        volume: 4,
        style: function () {},
        conf: function () {}
    });

    // Emitter's heartbeat - activate some particles.
    function step() {
        var set = bank.splice(0, this.volume),
            i, id, len = set.length;
        for (i = 0; i < len; i += 1) {
            set[i].start();
        }
    }

    return Collection(opts).extend({
        sorted: false,
        speed: opts.speed,
        volume: opts.volume,
        _create: function () {
            var i, particle, conf;
            // Generate a pool of 50 particles to use.
            for (i = 0; i < 50; i += 1) {
                conf = opts.conf() || {};
                conf.owner = this;
                conf.pos = conf.pos || opts.pos.clone();
                particle = opts.type(conf);
                bank.push(particle);
                this.set.push(particle);
            }

            // Only repeat if a non-zero speed was set.
            if (this.speed) {
                hash = timer.setInterval(step, this.speed, this);
            }
            step.call(this);
        },
        draw: function (ctx) {
            opts.style(ctx);
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
            particle.reset();
            bank.push(particle);
        }
    });
};
