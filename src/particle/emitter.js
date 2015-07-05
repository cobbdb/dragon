var Collection = require('../collection.js'),
    Util = require('../util/object.js');

/**
 * @class ParticleEmitter
 * @extends Collection
 * Generates a fountain of particles at a given location.
 * @param {ParticleConstructor} opts.type Constructor to
 * use when spawning Particles.
 * @param {Number} [opts.speed] Defaults to 4. Number of
 * Particles to spawn per second.
 */
module.exports = function (opts) {
    var hash;

    opts = Util.mergeDefaults(opts, {
        name: 'dragon-emitter',
        kind: 'dragon-emitter'
    });

    function step() {
        var i,
            len = 5,
            set = [];
        for (i = 0; i < len; i += 1) {
            set.push(
                opts.type(this, {
                    pos: opts.pos,
                    style: opts.style
                })
            );
        }

        this.add(set);
    }

    return Collection(opts).extend({
        speed: opts.speed || 4,
        _create: function () {
            hash = global.setInterval(
                step.bind(this),
                1000 / this.speed
            );
        },
        kill: function () {
            global.clearInterval(hash);
        }
    });
};
