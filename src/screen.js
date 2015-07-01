var Collection = require('./collection.js'),
    Util = require('./util/object.js'),
    Game = require('./game.js');

/**
 * @class Screen
 * @extends Collection
 * @param {Array|Sprite} [opts.sprites]
 * @param {Array|CollisionHandler} [opts.collisions]
 */
module.exports = function (opts) {
    var collisions = Collection().add(opts.collisions);

    opts = Util.mergeDefaults(opts, {
        name: 'dragon-screen',
        kind: 'dragon-screen',
        updating: false,
        drawing: false
    });

    return Collection(opts).add(opts.sprites).extend({
        load: function (cb) {
            cb();
        },
        start: function () {
            collisions.start();
            this.base.start();
        },
        pause: function () {
            collisions.pause();
            this.base.pause();
        },
        stop: function () {
            collisions.stop();
            this.base.stop();
        },
        /**
         * @param {Array|CollisionHandler} set
         */
        addCollisions: collisions.add,
        /**
         * @param {String} name
         * @return {Sprite}
         */
        sprite: function (name) {
            return this.base.get(name);
        },
        /**
         * @param {Array|Sprite} set
         */
        addSprites: function (set) {
            this.base.add(set);
        },
        /**
         * @param {String} name
         */
        removeSprite: function (name) {
            this.base.remove(name);
        },
        /**
         * Flush all sprites from this screen immediately.
         */
        clearSprites: function () {
            this.base.clear();
        },
        update: function () {
            this.base.update();
            collisions.set.forEach(function (handler) {
                handler.handleCollisions();
            });
        },
        draw: function (ctx) {
            this.base.draw(ctx);
            if (Game.debug) {
                collisions.draw(ctx);
            }
        },
        teardown: function () {
            this.base.teardown();
            collisions.teardown();
        }
    });
};
