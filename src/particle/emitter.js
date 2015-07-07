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
 * @param {Object} [opts.particle] Particle options.
 */
module.exports = function (opts) {
    var hash,
        bank = [];

    opts = Obj.mergeDefaults(opts, {
        name: 'dragon-emitter',
        kind: 'dragon-emitter',
        pos: Point(),
        speed: 250,
        volume: 4,
        particle: {}
    });
    opts.particle.pos = opts.pos;

    // Emitter's heartbeat - activate some particles.
    function step() {
        var set = bank.splice(0, this.volume);
        this.add(set);
    }

    return Collection(opts).extend({
        speed: opts.speed,
        volume: opts.volume,
        _create: function () {
            var i;
            // Generate a pool of 50 particles to use.
            for (i = 0; i < 50; i += 1) {
                bank.push(
                    opts.type(this,
                        Obj.clone(opts.particle)
                    )
                );
            }

            // Only repeat if a non-zero speed was set.
            if (this.speed) {
                hash = timer.setInterval(step, this.speed, this);
            }
            step.call(this);
        },
        /**
         * Stop continuous spawn if possible.
         */
        kill: function () {
            timer.clearInterval(hash);
        },
        /**
         * Reset a particle and add it back to the bank.
         * @param {Particle} particle
         */
        reclaim: function (particle) {
            particle.reset();
            this.remove(particle);
            bank.push(particle);
        }
    });
};
