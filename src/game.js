var CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js'),
    FrameCounter = require('./frame-counter.js');

var pressEventName,
    endEventName,
    ctx,
    tapCollisionSet,
    heartbeat = false,
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
    endEventName = 'mouseup';
} else {
    // Mobile devices.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    pressEventName = 'touchstart';
    endEventName = 'touchend';
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
var Game = {
    get canvas () {
        return canvas;
    },
    get ctx () {
        return ctx;
    },
    get pressEventName () {
        return {
            start: pressEventName,
            end: endEventName
        };
    },
    get screenTap () {
        return tapCollisionSet;
    },
    screen: function (name) {
        return screenMap[name];
    },
    addScreens: function (set) {
        screensToAdd = screensToAdd.concat(set);
    },
    removeScreen: function (screen) {
        screen.removed = true;
        screenRemoved = true;
    },
    run: function (opts) {
        var speed, debug,
            that = this;

        opts = opts || {};
        speed = opts.speed || throttle;

        if (opts.debug) {
            window.Dragon = this;
        }

        if (!heartbeat) {
            screens.forEach(function (screen) {
                screen.start();
            });
            heartbeat = window.setInterval(function () {
                if (opts.debug) {
                    console.log('beat');
                }
                that.update();
                that.draw();
                FrameCounter.countFrame();
            }, speed);
        }
    },
    kill: function () {
        window.clearInterval(heartbeat);
        heartbeat = false;
        screens.forEach(function (screen) {
            screen.stop();
        });
    },
    update: function () {
        // Settle screen tap events.
        tapCollisionSet.handleCollisions();

        // Update the screen.
        screens.forEach(function (screen) {
            screen.update();
        });

        if (screensToAdd.length) {
            // Update the master screen list after updates.
            screensToAdd.forEach(function (screen) {
                screens.push(screen);
                if (screen.name) {
                    screenMap[screen.name] = screen;
                }
                /**
                 * --> Now that the screen is fully loaded into
                 * Dragon, when do we call start()?
                 */
            });
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
        screens.forEach(function (screen) {
            screen.draw(ctx);
        });
    }
};

module.exports = Game;
