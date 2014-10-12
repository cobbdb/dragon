var BaseClass = require('baseclassjs'),
    _ = require('lodash');

module.exports = function (opts) {
    var width, height, pressEventName, ctx,
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
        },
        addSprite: function (sprite) {
            spritesToAdd.push(sprite);
        },
        update: function () {
            spritesToAdd = [];

            // --> Update current screen.

            // Update sprites if the game is active.
            sprites.forEach(function (sprite) {
                // Don't update dead sprites.
                if (this.state === this.GameState.RUNNING && !sprite.removed) {
                    sprite.update();
                }
            });

            // Update the master sprite list after updates.
            sprites = _.union(sprites, spritesToAdd);
            sprites = sprites.filter(function (sprite) {
                return !sprite.removed;
            });
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
