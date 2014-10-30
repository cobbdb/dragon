var BaseClass = require('baseclassjs'),
    _ = require('lodash'),
    CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js');

module.exports = function (opts) {
    var pressEventName, ctx, tapCollisionSet,
        screen = Dimension(),
        spriteRemoved = false,
        nextAvailableId = 0,
        sprites = [],
        spritesToAdd = [],
        canvas = document.createElement('canvas');

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

    tapCollisionSet = CollisionHandler(
        Dimension(4, 4),
        screen
    );
    ctx = canvas.getContext('2d');
    document.addEventListener(pressEventName, function (event) {
        // Create a temporary click sprite in the 'screenTap'
        // collision set. This sprite gets removed at the end
        // of the update loop.
        // Use event.offsetX and event.offsetY for position.
        var tempthing = 'not sure what goes here yet';
        tapCollisionSet.update(tempthing);
    });
    document.body.appendChild(canvas);

    return {
        extend: BaseClass,
        // Provide event name for children to do their own binding.
        pressEventName: pressEventName,
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
        collisionSet: {
            screenTap: tapCollisionSet
        },
        addCollisionSet: function (name, size) {
            this.collisionSet[name] = CollisionHandler(size, screen);
        },
        update: function () {
            if (this.state === this.GameState.RUNNING) {
                // Handle any collisions.
                for (i in this.collisionSet) {
                    this.collisionSet[i].handleCollisions();
                }
            }
        },
        draw: function () {
        },
        nextScreen: function () {
        }
    };
};
