var BaseClass = require('baseclassjs');

/**
 * @param opts.spriteSet Array
 * @param opts.collisionSets Array
 * @param opts.name
 * @param opts.depth
 */
module.exports = function (opts) {
    var sprites = [],
        spriteMap = {},
        spritesToAdd = [],
        spriteRemoved = false,
        collisionMap = {},
        updating = false,
        drawing = false;

    opts.spriteSet = opts.spriteSet || [];
    opts.collisionSets = opts.collisionSets || [];

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
        addSprite: function (sprite) {
            spritesToAdd.push(sprite);
        },
        addSpriteSet: function (set) {
            spritesToAdd = spritesToAdd.concat(set);
        },
        removeSprite: function (sprite) {
            sprite.removed = true;
            spriteRemoved = true;
        },
        update: function () {
            var i;

            if (updating) {
                // Update sprites.
                sprites.forEach(function (sprite) {
                    if (!updating) {
                        // Stop if screen has halted.
                        break;
                    } else if (!sprite.removed) {
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
                    sprites.push(sprite);
                    if (sprite.name) {
                        spriteMap[sprite.name] = sprite;
                    }
                });
                // Sort by descending sprite depths.
                sprites.sort(function (a, b) {
                    return b.depth - a.depth;
                });
                spritesToAdd = [];
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
