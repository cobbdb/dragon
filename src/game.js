var CollisionHandler = require('./collision-handler.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js'),
    FrameCounter = require('./frame-counter.js');

var pressEventName,
    endEventName,
    ctx,
    debug = false,
    tapCollisionSet,
    heartbeat = false,
    throttle = 50,
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

tapCollisionSet = CollisionHandler({
    name: 'screentap',
    gridSize: Dimension(4, 4),
    canvasSize: canvas
});
ctx = canvas.getContext('2d');
document.addEventListener(pressEventName, function (event) {
    tapCollisionSet.update(Collidable({
        name: 'screentap',
        mask: Circle(
            Point(
                event.offsetX,
                event.offsetY
            ),
            12
        )
    }));
});
document.body.appendChild(canvas);

/**
 * @param screenSet Array
 */
module.exports = {
    canvas: canvas,
    ctx: ctx,
    pressEventName: function () {
        return {
            start: pressEventName,
            end: endEventName
        };
    },
    screenTap: tapCollisionSet,
    screen: function (name) {
        return screenMap[name];
    },
    /**
     * @param {Array|Screen} opts.set
     * @param {Function} [opts.onload]
     */
    addScreens: function (opts) {
        var onload = opts.onload || function () {};
        screensToAdd = screensToAdd.concat(opts.set);
        /**
         * onload should be some behaviors after all
         * screens have finished loading.
         */
    },
    removeScreen: function (screen) {
        screen.removed = true;
        screenRemoved = true;
    },
    run: function (opts) {
        var speed,
            that = this;

        opts = opts || {};
        speed = opts.speed || throttle;
        debug = opts.debug;

        if (debug) {
            window.Dragon = this;
        }

        if (!heartbeat) {
            screens.forEach(function (screen) {
                screen.start();
            });
            heartbeat = window.setInterval(function () {
                if (debug) {
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
                if (screen.name()) {
                    screenMap[screen.name()] = screen;
                }
                screen.trigger('ready');
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
            screen.draw(ctx, debug);
        });
        if (debug) {
            tapCollisionSet.draw(ctx);
            FrameCounter.draw(ctx);
        }
    }
};
