var BaseClass = require('baseclassjs'),
    Collidable = require('./collidable.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    Rectangle = require('./rectangle.js'),
    Util = require('./util.js');

/**
 * ##### Sprite
 * @param {Map Of AnimationStrip} [opts.strips]
 * @param {String} [opts.startingStrip] Defaults to first
 * strip name.
 * @param {Point} [opts.pos] Defaults to (0,0).
 * @param {Number} [opts.scale] Defaults to 1.
 * @param {Dimension} [opts.size] Defaults to strip size.
 * @param {Number} [opts.depth] Defaults to 0.
 * @param {Number} [opts.rotation] Defaults to 0.
 * @param {Point} [opts.speed] Defaults to (0,0).
 * @param {Boolean} [opts.freemask] Defaults to false. True
 * to decouple the position of the mask from the position
 * of the sprite.
 * @param {Boolean} [opts.solid] True to collide with other
 * solid sprites.
 * @param {Boolean} [opts.drawing] Defaults to false.
 * @param {Boolean} [opts.updating] Defaults to false.
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} [opts.name]
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {Object} [opts.on] Dictionary of events.
 * @param {Object} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var loaded = false,
        stripMap = opts.strips || {},
        pos = opts.pos || Point();

    Util.mergeDefaults(opts, {
        name: 'dragon-texture-sprite',
        startingStrip: opts.startingStrip || global.Object.keys(stripMap)[0]
    });

    if (!opts.freemask) {
        opts.offset = opts.mask.pos();
        opts.mask.move(
            pos.add(opts.offset)
        );
    }

    return Sprite(opts).extend({
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
        },
        /**
         * Move the Sprite and its mask unless freemask.
         * @param {Point} pos
         */
        move: function (pos) {
            this.pos.move(pos, true);
            if (!opts.freemask) {
                this.base.move(this.pos);
            }
        },
        /**
         * @param {Point|Vector} offset
         */
        shift: function (offset) {
            this.pos.add(offset || this.speed, true);
            if (!opts.freemask) {
                this.base.move(this.pos);
            }
        }
    });
};
