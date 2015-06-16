var SpriteSet = require('./sprite-set.js');

/**
 * # Screen
 * @param {Array|Sprite} [opts.spriteSet]
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {String} opts.name
 * @param {Number} [opts.depth] Defaults to 0.
 * @param {Object} [opts.on] Dictionary of events.
 * @param {Object} [opts.one] Dictionary of one-time events.
 * @return {Screen}
 */
module.exports = function (opts) {
    var loaded = false,
        collisionMap = {};

    return SpriteSet(opts).extend({
        name: opts.name,
        updating: false,
        drawing: false,
        load: function (cb) {
            if (!loaded) {
                this.addCollisionSets(opts.collisionSets);
                this.base.add({
                    set: opts.spriteSet,
                    onload: cb,
                    force: true
                });
                loaded = true;
            }
        },
        start: function () {
            this.updating = true;
            this.drawing = true;
            this.trigger('start');
        },
        pause: function () {
            this.updating = false;
            this.drawing = true;
            this.trigger('pause');
        },
        stop: function () {
            this.updating = false;
            this.drawing = false;
            this.trigger('stop');
        },
        depth: opts.depth || 0,
        collision: function (name) {
            return collisionMap[name];
        },
        /**
         * @param {Array|CollisionHandler} set
         */
        addCollisionSets: function (set) {
            if (set) {
                set = [].concat(set);
                set.forEach(function (handler) {
                    collisionMap[handler.name] = handler;
                });
            }
        },
        sprite: function (name) {
            return this.base.get(name);
        },
        /**
         * Loads sprites into this screen together
         * as a batch. None of the batch will be
         * loaded into the screen until all sprites
         * are ready.
         * @param {Array|Sprite} opts.set
         * @param {Function} [onload]
         * @param {Boolean} [force] Defaults to false. True
         * to ingest sprites immediately outside of the normal
         * game pulse.
         */
        addSprites: function (opts) {
            this.base.add(opts);
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
            var i;

            if (this.updating) {
                // Update sprites.
                this.base.update();

                // Process collisions.
                for (i in collisionMap) {
                    collisionMap[i].handleCollisions();
                }
            }
        },
        draw: function (ctx, debug) {
            var name;
            if (this.drawing) {
                this.base.draw(ctx);
                if (debug) {
                    for (name in collisionMap) {
                        collisionMap[name].draw(ctx);
                    }
                }
            }
        },
        teardown: function () {
            var i;

            this.base.teardown();

            for (i in collisionMap) {
                collisionMap[i].teardown();
            }
        }
    });
};
