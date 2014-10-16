var BaseClass = require('baseclassjs'),
    _ = require('lodash'),
    CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js');

module.exports = function (opts) {
    var pressEventName, ctx,
        screen = Dimension(),
        spriteRemoved = false,
        nextAvailableId = 0,
        sprites = [],
        spritesToAdd = [],
        canvas = document.createElement('canvas');

    opts.onpress = opts.onpress || function () {};

    if (window.innerWidth >= 500) {
        // Large screen devices.
        canvas.width = screen.width = 320;
        canvas.height = screen.height = 480;
        canvas.style.border = '1px solid #000';
        pressEventName = 'mousedown';
    } else {
        // Mobile devices.
        canvas.width = screen.width = window.innerWidth;
        canvas.height = screen.height = window.innerHeight;
        pressEventName = 'touchstart';
    }

    ctx = canvas.getContext('2d');
    document.addEventListener(pressEventName, function (event) {
        // Create a temporary click sprite in the 'screenTap'
        // collision set. This sprite gets removed at the end
        // of the update loop.
        // Use event.offsetX and event.offsetY for position.
        var tempthing = 'not sure what goes here yet';
        game.collisionSet.screenTap.update(tempthing);

        // Run any custom onpress behavior.
        opts.onpress(event);
    });
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
         * game.addCollisionSet('playerVsEnemies', Dimension(4, 3));
         * .. then reference like ..
         * badGuy = Sprite({
         *      collisionSet: [
         *          game.collisionSet.playerVsEnemies,
         *          game.collisionSet.otherStuff
         *      ],
         *      ..
         * });
         */
        collisionSet: {
            screenTap: CollisionHandler(
                Dimension(7, 7),
                screen
            )
        },
        addCollisionSet: function (name, size) {
            this.collisionSet[name] = CollisionHandler(size, screen);
        },
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
