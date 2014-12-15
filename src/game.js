var CollisionHandler = require('./collision-handler.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js'),
    FrameCounter = require('./frame-counter.js'),
    Mouse = require('./mouse.js'),
    canvas = require('./canvas.js').canvas,
    ctx = require('./canvas.js').ctx;

var debug = false,
    heartbeat = false,
    throttle = 50,
    screens = [],
    screenMap = {},
    screensToAdd = [],
    screenRemoved = false,
    tapCollisionSet = CollisionHandler({
        name: 'screentap',
        gridSize: Dimension(4, 4),
        canvasSize: canvas
    });

Mouse.on.down(function () {
    tapCollisionSet.update(Collidable({
        name: 'screentap',
        mask: Circle(Mouse.offset, 10)
    }));
});
Mouse.on.drag(function () {
    tapCollisionSet.update(Collidable({
        name: 'screendrag',
        mask: Circle(Mouse.offset, 10)
    }));
});

/**
 * @param screenSet Array
 */
module.exports = {
    canvas: canvas,
    ctx: ctx,
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
                that.update();
                that.draw();
                that.teardown();
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
        if (Mouse.is.holding && !Mouse.is.dragging) {
            tapCollisionSet.update(Collidable({
                name: 'screenhold',
                mask: Circle(Mouse.offset, 15)
            }));
        }

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
                screen.trigger('ready', screen);
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
            FrameCounter.draw(ctx);
            if (Mouse.is.down) {
                tapCollisionSet.draw(ctx);
            }
        }
    },
    teardown: function () {
        tapCollisionSet.teardown();
        screens.forEach(function (screen) {
            screen.teardown();
        });
    }
};
