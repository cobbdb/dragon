var BaseClass = require('baseclassjs'),
    EventHandler = require('./event-handler.js'),
    Counter = require('./id-counter.js');

/**
 * @param {Array|Sprite} [opts.spriteSet]
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {String} opts.name
 * @param {Number} [opts.depth] Defaults to 0.
 * @param {Object} [opts.on] Dictionary of events.
 * @param {Object} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var self,
        loaded = false,
        sprites = [],
        spriteMap = {},
        spritesToAdd = [],
        spritesLoading = [],
        loadQueue = {},
        spriteRemoved = false,
        collisionMap = {},
        updating = false,
        drawing = false;

    self = BaseClass({
        name: opts.name,
        load: function (cb) {
            if (!loaded) {
                this.addSprites({
                    set: opts.spriteSet,
                    onload: cb
                });
                loaded = true;
            }
        },
        start: function () {
            sprites.forEach(function (sprite) {
                sprite.strip.start();
            });
            updating = true;
            drawing = true;
            this.trigger('start');
        },
        pause: function () {
            sprites.forEach(function (sprite) {
                sprite.strip.pause();
            });
            updating = false;
            drawing = true;
            this.trigger('pause');
        },
        stop: function () {
            sprites.forEach(function (sprite) {
                sprite.strip.stop();
            });
            updating = false;
            drawing = false;
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
            return spriteMap[name];
        },
        /**
         * Loads sprites into this screen together
         * as a batch. None of the batch will be
         * loaded into the screen until all sprites
         * are ready.
         * @param {Array|Sprite} opts.set
         * @param {Function} [onload]
         */
        addSprites: function (opts) {
            var id, onload, set;
            opts = opts || {};

            if (opts.set) {
                onload = opts.onload || function () {};
                set = [].concat(opts.set);
                id = Counter.nextId;

                loadQueue[id] = set.length;
                set.forEach(function (sprite) {
                    sprite.load(function () {
                        loadQueue[id] -= 1;
                        if (loadQueue[id] === 0) {
                            spritesToAdd = spritesToAdd.concat(set);
                            onload();
                        }
                    });
                });
            }
        },
        removeSprite: function (sprite) {
            sprite.removed = true;
            spriteRemoved = true;
        },
        update: function () {
            var i;

            // Update sprites.
            sprites.forEach(function (sprite) {
                if (updating && !sprite.removed) {
                    // Don't update dead sprites.
                    sprite.update();
                }
            });

            // Process collisions.
            for (i in collisionMap) {
                collisionMap[i].handleCollisions();
            }

            if (spritesToAdd.length) {
                // Update the master sprite list after updates.
                spritesToAdd.forEach(function (sprite) {
                    sprites.push(sprite);
                    if (sprite.name) {
                        spriteMap[sprite.name] = sprite;
                    }
                    sprite.strip.start();
                });
                // Sort by descending sprite depths.
                sprites.sort(function (a, b) {
                    return b.depth - a.depth;
                });
                spritesToAdd = [];
            }
        },
        draw: function (ctx, debug) {
            var name;
            if (drawing) {
                sprites.forEach(function (sprite) {
                    sprite.draw(ctx);
                });
                if (debug) {
                    for (name in collisionMap) {
                        collisionMap[name].draw(ctx);
                    }
                }
            }
        },
        teardown: function () {
            var i;

            if (updating) {
                sprites.forEach(function (sprite) {
                    if (!sprite.removed) {
                        // Don't update dead sprites.
                        sprite.teardown();
                    }
                });
            }

            for (i in collisionMap) {
                collisionMap[i].teardown();
            }

            if (spriteRemoved) {
                // Remove any stale sprites.
                sprites = sprites.filter(function (sprite) {
                    // true to keep, false to drop.
                    return !sprite.removed;
                });
                spriteRemoved = false;
            }
        }
    }).implement(
        EventHandler({
            events: opts.on,
            singles: opts.one
        })
    );

    // Load in collision handlers.
    self.addCollisionSets(opts.collisionSets);

    return self;
};
