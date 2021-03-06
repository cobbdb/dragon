var ClearSprite = require('./clear-sprite.js'),
    Dimension = require('./geom/dimension.js'),
    AnimationStrip = require('./animation-strip.js'),
    Util = require('./util/object.js');

/**
 * @class Sprite
 * @extends ClearSprite
 * Most common use-case sprite that contains collision
 * logic and textures.
 * @param {Map Of AnimationStrip} [opts.strips]
 * @param {Map Of String} [opts.strips] Convenience option for
 * AnimationStrips with no special options.
 * @param {String} [opts.strips] Convenience option for Sprites
 * with only a single AnimationStrip with no special options.
 * @param {String} [opts.startingStrip] Defaults to first
 * strip name.
 */
module.exports = function (opts) {
    var name, strip,
        stripMap = opts.strips || {};

    // When opts.strips is set to a single String.
    if (typeof stripMap === 'string') {
        stripMap = {
            strip: stripMap
        };
    }
    // When opts.strips has String values.
    for (name in stripMap) {
        strip = stripMap[name];
        if (typeof strip === 'string') {
            stripMap[name] = AnimationStrip(strip);
        }
    }

    opts.name = opts.name || '$:sprite';
    opts.kind = opts.kind || '$.sprite';
    opts.startingStrip = opts.startingStrip || global.Object.keys(stripMap)[0];
    opts.size = opts.size || (stripMap[opts.startingStrip] || {}).size;

    return ClearSprite(opts).extend({
        strip: stripMap[opts.startingStrip],
        useStrip: function (name) {
            // Do nothing if already using this strip.
            if (this.strip !== stripMap[name]) {
                this.strip.stop();
                this.strip = stripMap[name];
                this.strip.start();
            }
        },
        getStrip: function (name) {
            return stripMap[name];
        },
        start: function () {
            this.base.start();
            this.strip.start();
        },
        pause: function () {
            this.base.pause();
            this.strip.pause();
        },
        stop: function () {
            this.base.stop();
            this.strip.stop();
        },
        update: function () {
            if (this.strip.updating) {
                this.strip.update();
            }
            this.base.update();
        },
        draw: function (ctx) {
            this.base.draw(ctx);
            this.strip.draw(ctx, this.size());
        }
    });
};
