var BaseClass = require('baseclassjs');

/**
 * @param {Array|Sprite} [opts.spriteSet]
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {String} opts.name
 * @param {Number} [opts.depth] Defaults to 0.
 */
module.exports = function (opts) {
    var sprites = [],
        spriteMap = {},
        spritesToAdd = [],
        spritesLoading = [],
        spriteRemoved = false,
        collisionMap = {},
        updating = false,
        drawing = false;

    opts.spriteSet = [].concat(opts.spriteSet);
    opts.collisionSets = [].concat(opts.collisionSets);

    // Load in the sprites.
    opts.spriteSet.forEach(function (sprite) {
        spritesToAdd.push(sprite);
        if (sprite.name) {
            spriteMap[sprite.name] = sprite;
        }
    });
    // Load in collision handlers.
    opts.collisionSets.forEach(function (handler) {
        collisionMap[handler.name] = handler;
    });

    return BaseClass({
        get name () {
            return opts.name;
        },
        start: function () {
            sprites.forEach(function (sprite) {
                sprite.strip.start();
            });
            updating = true;
            drawing = true;
        },
        pause: function () {
            sprites.forEach(function (sprite) {
                sprite.strip.pause();
            });
            updating = false;
            drawing = true;
        },
        stop: function () {
            sprites.forEach(function (sprite) {
                sprite.strip.stop();
            });
            updating = false;
            drawing = false;
        },
        depth: opts.depth || 0,
        collisionSet: function (name) {
            return collisionMap[name];
        },
        addCollisionSet: function (handler) {
            collisionMap[handler.name] = handler;
        },
        sprite: function (name) {
            return spriteMap[name];
        },
        addSprites: function (set) {
            spritesToAdd = spritesToAdd.concat(set);
        },
        removeSprite: function (sprite) {
            sprite.removed = true;
            spriteRemoved = true;
        },
        update: function () {
            var i,
                doSort = false,
                spritesLoading = [];

            if (updating) {
                // Update sprites.
                sprites.forEach(function (sprite) {
                    if (updating && !sprite.removed) {
                        // Don't update dead sprites.
                        sprite.update();
                    }
                });

                // Update collisions.
                for (i in collisionMap) {
                    collisionMap[i].handleCollisions();
                }
            }

            if (spritesToAdd.length) {
                // Update the master sprite list after updates.
                spritesToAdd.forEach(function (sprite) {
                    if (sprite.ready) {
                        // Load the sprite into the game engine
                        // if its resources are done loading.
                        sprites.push(sprite);
                        if (sprite.name) {
                            spriteMap[sprite.name] = sprite;
                        }
                        doSort = true;
                    } else {
                        // Stash loading sprites for this frame.
                        spritesLoading.push(sprite);
                    }
                });
                if (doSort) {
                    // Sort by descending sprite depths.
                    sprites.sort(function (a, b) {
                        return b.depth - a.depth;
                    });
                }
                spritesToAdd = spritesLoading;
            }
            if (spriteRemoved) {
                // Remove any stale sprites.
                sprites = sprites.filter(function (sprite) {
                    // true to keep, false to drop.
                    return !sprite.removed;
                });
                spriteRemoved = false;
            }
        },
        draw: function (ctx) {
            if (drawing) {
                sprites.forEach(function (sprite) {
                    sprite.draw(ctx);
                });
            }
        }
    });
};
