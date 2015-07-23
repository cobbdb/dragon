var Collection = require('./collection.js'),
    Obj = require('./util/object.js'),
    Game = require('./game.js');

/**
 * @class Screen
 * @extends Collection
 * @param {Array|Sprite} [opts.sprites]
 * @param {Array|CollisionHandler} [opts.collisions]
 */
module.exports = function (opts) {
    var collisions = Collection({
        name: '$:screen-collisions',
        sorted: false
    }).add(opts.collisions);

    opts = Obj.mergeDefaults(opts, {
        name: '$:screen',
        kind: '$:screen',
        updating: false,
        drawing: false
    });

    return Collection(opts).extend({
        _create: function () {
            this.add(opts.sprites);
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
         * @param {Sprite} sprite
         */
        removeSprite: function (sprite) {
            this.base.remove(sprite);
        },
        /**
         * Flush all sprites from this screen immediately.
         */
        clearSprites: function () {
            this.base.clear();
        },
        update: function () {
            var i, len = collisions.set.length;

            this.base.update();
            for (i = 0; i < len; i += 1) {
                collisions.set[i].handleCollisions();
            }
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
