var BaseClass = require('baseclassjs'),
    _ = require('lodash');

module.exports = function (opts) {
    var width, height, pressEventName, ctx,
        spriteRemoved = false,
        nextAvailableId = 0,
        sprites = [],
        spritesToAdd = [],
        canvas = document.createElement('canvas');

    if (window.innerWidth >= 500) {
        // Large screen devices.
        canvas.width = width = 320;
        canvas.height = height = 480;
        canvas.style.border = '1px solid #000';
        pressEventName = 'mousedown';
    } else {
        // Mobile devices.
        canvas.width = width = window.innerWidth;
        canvas.height = height = window.innerHeight;
        pressEventName = 'touchstart';
    }

    ctx = canvas.getContext('2d');
    // --> On press should be optional. Find sprite collisions
    //     and delegate. Signal event instead for optional bindings.
    document.addEventListener(pressEventName, opts.onpress);
    document.body.appendChild(canvas);

    return {
        extend: BaseClass,
        GameState: {
            READY: 0,
            RUNNING: 1,
            TRANSITION: 2
        },
        state: 0,
        nextId: function () {
            // --> IS THIS EVEN STILL NEEDED?
            nextAvailableId += 1;
            return nextAvailableId;
        },
        removeSprite: function (sprite) {
            sprite.removed = true;
            spriteRemoved = true;
        },
        addSprite: function (sprite) {
            spritesToAdd.push(sprite);
        },
        /**
         * Add new handler with
         * game.collisionSet.playerVsEnemies = Handler(..);
         * .. then reference like ..
         * badGuy = Sprite({
         *      collisionSet: [
         *          game.collisionSet.playerVsEnemies,
         *          game.collisionSet.otherStuff
         *      ],
         *      ..
         * });
         */
        collisionSet: {},
        update: function () {
            var i;
            spritesToAdd = [];

            // --> Update current screen.

            // Update sprites if the game is active.
            sprites.forEach(function (sprite) {
                // Stop if game has halted.
                if (this.state !== this.GameState.RUNNING) {
                    break;
                }
                // Don't update dead sprites.
                if (!sprite.removed) {
                    sprite.update();
                }
            });

            if (this.state === this.GameState.RUNNING) {
                // Handle any collisions.
                for (i in this.collisionSet) {
                    this.collisionSet[i].handleCollisions();
                }
            }

            if (spritesToAdd.length) {
                // Update the master sprite list after updates.
                sprites = _.union(sprites, spritesToAdd);
                // Sort by descending sprite depths.
                sprites.sort(function (a, b) {
                    return b.depth - a.depth;
                });
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
        draw: function () {
            // --> Draw current screen.

            // Draw the Sprites.
            sprites.forEach(function (sprite) {
                sprite.draw(ctx);
            });
        },
        nextScreen: function () {
        }
    };
};
