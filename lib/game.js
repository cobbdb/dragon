var CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js'),
    _ = require('lodash');

var pressEventName,
    ctx,
    tapCollisionSet,
    heartbeat,
    throttle = 100,
    canvas = document.createElement('canvas'),
    screens = [],
    screenMap = {},
    screensToAdd = [],
    screenRemoved = false;

if (window.innerWidth >= 500) {
    // Large screen devices.
    canvas.width = 320;
    canvas.height = 480;
    canvas.style.border = '1px solid #000';
    pressEventName = 'mousedown';
} else {
    // Mobile devices.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pressEventName = 'touchstart';
}

tapCollisionSet = CollisionHandler(
    Dimension(4, 4),
    canvas
);
ctx = canvas.getContext('2d');
document.addEventListener(pressEventName, function (event) {
    tapCollisionSet.update(Collidable({
        name: 'screentap',
        mask: Circle(
            event.offsetX,
            event.offsetY,
            12
        )
    }));
});
document.body.appendChild(canvas);

/**
 * @param screenSet Array
 */
module.exports = {
    get canvas () {
        return canvas;
    },
    get ctx () {
        return ctx;
    },
    get screenTap () {
        return tapCollisionSet;
    },
    screen: function (name) {
        return screenMap[name];
    },
    addScreen: function (screen) {
        screensToAdd.push(screen);
        if (screen.name) {
            screenMap[screen.name] = screen;
        }
    },
    addScreenSet: function (set) {
        screensToAdd = screensToAdd.concat(set);
    },
    removeScreen: function (screen) {
        screen.removed = true;
        screenRemoved = true;
    },
    run: function (speed) {
        // Update throttle.
        throttle = speed || throttle;

        screens.forEach(function (screen) {
            screen.start();
        });
        heartbeat = window.setTimeout(function () {
            this.update();
            this.draw();
        }, throttle);
    },
    update: function () {
        var i;

        // Settle screen tap events.
        tapCollisionSet.handleCollisions();

        // Update the screen.
        screens.forEach(function (screen) {
            screen.update();
        });

        if (screensToAdd.length) {
            // Update the master screen list after updates.
            screens = _.union(screens, screensToAdd);
            // Sort by descending sprite depths.
            screens.sort(function (a, b) {
                return b.depth - a.depth;
            });
            screensToAdd = [];
        }
        if (screenRemoved) {
            // Remove any stale screens.
            screens = screens.filter(function (screen) {
                // true to keep, false to drop.
                return !screen.removed;
            });
            screenRemoved = false;
        }
    },
    draw: function () {
        screenStack.forEach(function (screen) {
            screen.draw(ctx);
        });
    }
};
