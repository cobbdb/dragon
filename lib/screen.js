var BaseClass = require('baseclassjs');

module.exports = function (opts) {
    var sprites = opts.spriteSet || [],
        spritesToAdd = [],
        spriteRemoved = false;

    return BaseClass({
        state: 'LOADING',
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
            // Update sprites if the game is active.
            if (this.state === 'RUNNING') {
                sprites.forEach(function (sprite) {
                    // Stop if game has halted.
                    if (this.state !== 'RUNNING') {
                        break;
                    }
                    // Don't update dead sprites.
                    if (!sprite.removed) {
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
            if (this.state === 'RUNNING') {
                sprites.forEach(function (sprite) {
                    sprite.draw(ctx);
                });
            }
        }
    });
};
