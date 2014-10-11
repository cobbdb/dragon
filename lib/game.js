var BaseClass = require('baseclassjs');

module.exports = function (opts) {
    var width, height, pressEventName, ctx,
        gameState = 0,
        nextAvailableId = 0,
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
    document.addEventListener(pressEventName, opts.onpress);
    document.body.appendChild(canvas);

    return {
        extend: BaseClass,
        GameState: {
            READY: 0,
            RUNNING: 1,
            TRANSITION: 2
        },
        get state () {
            return gameState;
        },
        sprites: [],
        spritesToAdd: [],
        spritesToRemove: [],
        clearSprites: function () {
            this.spriteList = this.spritesToAdd = this.spritesToRemove = [];
        },
        nextId: function () {
            nextAvailableId += 1;
            return nextAvailableId;
        },
        update: function () {
        },
        draw: function () {
            // Draw current screen.

            // Draw the Sprites.
            this.sprites.forEach(function (sprite) {
                sprite.draw(ctx);
            });
        }
    };
};
