var BaseClass = require('baseclassjs'),
    _ = require('lodash');

module.exports = function (opts) {
    var sprites = opts.spriteSet || [],
        spriteMap = {},
        spritesToAdd = [],
        spriteRemoved = false;

    return BaseClass({
        get name () {
            return opts.name;
        },
        updating: true,
        drawing: true,
        depth: opts.depth || 0,
        sprite: function (name) {
            return spriteMap[name];
        },
        addSprite: function (sprite) {
            spritesToAdd.push(sprite);
            if (sprite.name) {
                spriteMap[sprite.name] = sprite;
            }
        },
        addSpriteSet: function (set) {
            spritesToAdd = spritesToAdd.concat(set);
        },
        removeSprite: function (sprite) {
            sprite.removed = true;
            spriteRemoved = true;
        },
        update: function () {
            // Update sprites if the screen is active.
            if (this.updating) {
                sprites.forEach(function (sprite) {
                    if (!this.updating) {
                        // Stop if screen has halted.
                        break;
                    } else if (!sprite.removed) {
                        // Don't update dead sprites.
                        sprite.update();
                    }
                });
            }

            if (spritesToAdd.length) {
                // Update the master sprite list after updates.
                sprites = _.union(sprites, spritesToAdd);
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
            if (this.drawing) {
                sprites.forEach(function (sprite) {
                    sprite.draw(ctx);
                });
            }
        }
    });
};
