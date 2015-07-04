var Collection = require('../collection.js');
    // Particle = require('./base.js');
    // ParticleType = require('./spiral.js');

/**
 * @class ParticleEmitter
 * @extends Collection
 * Generates a fountain of particles at a given location.
 * @param {ParticleConstructor} opts.type Constructor to
 * use when spawning Particles.
 * @param {Number} [opts.speed] Defaults to 4. Number of
 * Particles to spawn per second.
 * @param {Function} [opts.style] Special canvas setup to
 * perform before Particles are drawn.
 */
module.exports = function (opts) {
    var hash;

    return Collection(opts).extend({
        speed: opts.speed || 4,
        _create: function () {
            hash = global.setInterval(function () {
            }, 1000 / this.speed);
        },
        kill: function () {
            global.clearInterval(hash);
        }
    });
};
