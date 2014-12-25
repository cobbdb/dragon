var CollisionHandler = require('./collision-handler.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js'),
    FrameCounter = require('./frame-counter.js'),
    Mouse = require('./mouse.js'),
    canvas = require('./canvas.js'),
    ctx = canvas.ctx,
    Counter = require('./id-counter.js');

var debug = false,
    heartbeat = false,
    throttle = 30,
    screens = [],
    screenMap = {},
    screensToAdd = [],
    screenRemoved = false,
    tapCollisionSet = CollisionHandler({
        name: 'screentap',
        gridSize: Dimension(4, 4),
        canvasSize: canvas
    }),
    loadQueue = {};

Mouse.on.down(function () {
    tapCollisionSet.update(Collidable({
        name: 'screentap',
        mask: Circle(Mouse.offset, 15)
    }));
});

module.exports = {
    canvas: canvas,
    screenTap: tapCollisionSet,
    screen: function (name) {
        return screenMap[name];
    },
    /**
     * Loads screen into the game together
     * as a batch. None of the batch will be
     * loaded into the game until all screens
     * are ready.
     * @param {Array|Screen} set
     */
    addScreens: function (set) {
        var id;
        if (set) {
            set = [].concat(set);
            id = Counter.nextId;

            loadQueue[id] = set.length;
            set.forEach(function (screen) {
                screen.load(function () {
                    loadQueue[id] -= 1;
                    if (loadQueue[id] === 0) {
                        screensToAdd = screensToAdd.concat(set);
                    }
                });
            });
        }
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
    /**
     * Apply new data to the game.
     */
    update: function () {
        if (Mouse.is.dragging) {
            tapCollisionSet.update(Collidable({
                name: 'screendrag',
                mask: Circle(Mouse.offset, 15)
            }));
        } else if (Mouse.is.holding) {
            tapCollisionSet.update(Collidable({
                name: 'screenhold',
                mask: Circle(Mouse.offset, 15)
            }));
        }

        // Update the screen.
        screens.forEach(function (screen) {
            screen.update();
        });

        // Settle screen tap events.
        tapCollisionSet.handleCollisions();

        if (screensToAdd.length) {
            // Update the master screen list after updates.
            screensToAdd.forEach(function (screen) {
                screens.push(screen);
                if (screen.name) {
                    screenMap[screen.name] = screen;
                }
                screen.trigger('ready');
            });
            // Sort by descending sprite depths.
            screens.sort(function (a, b) {
                return b.depth - a.depth;
            });
            screensToAdd = [];
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
    /**
     * Cleanup before the next frame.
     */
    teardown: function () {
        tapCollisionSet.teardown();
        screens.forEach(function (screen) {
            screen.teardown();
        });
        if (screenRemoved) {
            // Remove any stale screens.
            screens = screens.filter(function (screen) {
                // true to keep, false to drop.
                return !screen.removed;
            });
            screenRemoved = false;
        }
    }
};
