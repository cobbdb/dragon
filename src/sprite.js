var ClearSprite = require('./clear-sprite.js'),
    Point = require('./geom/point.js'),
    Dimension = require('./geom/dimension.js'),
    Rectangle = require('./geom/rectangle.js'),
    Util = require('./util/object.js');

/**
 * @class Sprite
 * Most common use-case sprite that contains collision
 * logic and textures.
 * @extends ClearSprite
 * @param {Map Of AnimationStrip} [opts.strips]
 * @param {String} [opts.startingStrip] Defaults to first
 * strip name.
 */
module.exports = function (opts) {
    var loaded = false,
        stripMap = opts.strips || {};

    Util.mergeDefaults(opts, {
        name: 'dragon-texture-sprite',
        startingStrip: opts.startingStrip || global.Object.keys(stripMap)[0],
    });
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
            if (this.updating) {
                this.strip.update();
            }
            this.base.update();
        },
        draw: function (ctx) {
            if (this.drawing) {
                this.strip.draw(
                    ctx,
                    this.pos,
                    Dimension(
                        this.scale * this.size.width / this.strip.size.width,
                        this.scale * this.size.height / this.strip.size.height
                    ),
                    this.rotation
                );
            }
            this.base.draw(ctx);
        },
        load: function (onload) {
            var name, loadQueue;
            onload = onload || function () {};
            if (!loaded) {
                loadQueue = global.Object.keys(stripMap).length;
                for (name in stripMap) {
                    stripMap[name].load(function () {
                        loadQueue -= 1;
                        if (loadQueue === 0) {
                            onload();
                            loaded = true;
                        }
                    });
                }
            } else {
                onload();
            }
        }
    });
};
