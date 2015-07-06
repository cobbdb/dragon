var Collection = require('../collection.js'),
    Point = require('../geom/point.js'),
    Util = require('../util/object.js'),
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
 * @param {Number} [opts.speed] Defaults to 4. Number of
 * steps per second.
 */
module.exports = function (opts) {
    var hash;

    opts = Util.mergeDefaults(opts, {
        name: 'dragon-emitter',
        kind: 'dragon-emitter',
        style: function () {},
        pos: Point(),
        speed: 4,
        volume: 4
    });

    function step() {
        var i,
            set = [];
        for (i = 0; i < this.volume; i += 1) {
            set.push(
                opts.type(this, {
                    pos: opts.pos.clone(),
                    style: opts.style
                })
            );
        }
        this.add(set);
    }

    return Collection(opts).extend({
        speed: opts.speed,
        volume: opts.volume,
        _create: function () {
            hash = timer.setInterval(
                step.bind(this),
                1000 / this.speed
            );
        },
        kill: function () {
            global.clearInterval(hash);
        }
    });
};
