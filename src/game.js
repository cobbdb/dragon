var CollisionHandler = require('./collision-handler.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Rectangle = require('./rectangle.js'),
    Collidable = require('./collidable.js'),
    FrameCounter = require('./frame-counter.js'),
    Mouse = require('./mouse.js'),
    canvas = require('./canvas.js'),
    ctx = canvas.ctx,
    Counter = require('./id-counter.js'),
    log = require('./log.js'),
    dragonCollisions = require('./dragon-collisions.js'),
    debug = false,
    screens = [],
    screenMap = {},
    screensToAdd = [],
    screenRemoved = false,
    loadQueue = {},
    running = false,
    masks = {
        screentap: Collidable({
            name: 'screentap',
            mask: Circle(Point(), 8)
        }),
        screendrag: require('./mask-screendrag.js'),
        screenhold: require('./mask-screenhold.js'),
        screenedge: {
            top: Collidable({
                name: 'screenedge/top',
                mask: Rectangle(
                    Point(0, -9),
                    Dimension(canvas.width, 10)
                )
            }),
            right: Collidable({
                name: 'screenedge/right',
                mask: Rectangle(
                    Point(canvas.width - 1, 0),
                    Dimension(10, canvas.height)
                )
            }),
            bottom: Collidable({
                name: 'screenedge/bottom',
                mask: Rectangle(
                    Point(0, canvas.height - 1),
                    Dimension(canvas.width, 10)
                )
            }),
            left: Collidable({
                name: 'screenedge/left',
                mask: Rectangle(
                    Point(-9, 0),
                    Dimension(10, canvas.height)
                )
            })
        }
    };

Mouse.on.down(function () {
    masks.screentap.move(Mouse.offset);
    dragonCollisions.update(masks.screentap);
});

module.exports = {
    debug: require('./debug-console.js'),
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
    /**
     * @param {Boolean} [debugMode] Defaults to false.
     */
    run: function (debugMode) {
        var that = this,
            step = function () {
                that.update();
                that.draw();
                that.teardown();
                FrameCounter.countFrame();
                if (running) {
                    window.requestAnimationFrame(step);
                }
            };

        debug = debugMode;
        if (debugMode) {
            window.Dragon = this;
        }

        if (!running) {
            running = true;
            window.requestAnimationFrame(step);
        }
    },
    kill: function () {
        running = false;
        screens.forEach(function (screen) {
            screen.stop();
        });
    },
    update: function () {
        masks.screendrag.update();
        masks.screenhold.update();
        dragonCollisions.update(masks.screendrag);
        dragonCollisions.update(masks.screenhold);
        dragonCollisions.update(masks.screenedge.top);
        dragonCollisions.update(masks.screenedge.right);
        dragonCollisions.update(masks.screenedge.bottom);
        dragonCollisions.update(masks.screenedge.left);

        // Update the screen.
        screens.forEach(function (screen) {
            if (screen.updating()) {
                screen.update();
            }
        });

        // Settle screen tap events.
        dragonCollisions.handleCollisions();

        if (screensToAdd.length) {
            // Update the master screen list after updates.
            screensToAdd.forEach(function (screen) {
                screens.push(screen);
                if (screen.name) {
                    screenMap[screen.name] = screen;
                }
                screen.trigger('ready');
            });
            // Larger depth value is closer to viewer.
            screens.sort(function (a, b) {
                return a.depth - b.depth;
            });
            screensToAdd = [];
        }
    },
    draw: function () {
        screens.forEach(function (screen) {
            if (screen.drawing()) {
                screen.draw(ctx, debug);
            }
        });
        if (debug) {
            FrameCounter.draw(ctx);
            dragonCollisions.draw(ctx);
        }
    },
    teardown: function () {
        dragonCollisions.teardown();
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
