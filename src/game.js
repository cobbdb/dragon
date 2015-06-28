var FrameCounter = require('./util/frame-counter.js'),
    ctx = require('./io/canvas.js').ctx,
    Counter = require('./util/id-counter.js'),
    dragonCollisions = require('./dragon-collisions.js'),
    pipeline = require('./assets/pipeline.js'),
    screens = [],
    screenMap = {},
    screensToAdd = [],
    screenRemoved = false,
    loadQueue = {},
    running = false,
    masks = require('./dragon-masks.js');

module.exports = {
    debug: false,
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
    /**
     * @param {String} name
     */
    removeScreen: function (name) {
        screenMap[name].removed = true;
        screenRemoved = true;
    },
    /**
     * @param {Boolean} [opts.debug] Defaults to false.
     * @param {Map Of Strings} opts.image
     * @param {Map Of Objects} opts.audio
     * @param {Object|Array Of Objects} opts.font
     */
    run: function (opts) {
        var that = this,
            step = function () {
                that.update();
                that.draw();
                that.teardown();
                FrameCounter.countFrame();
                if (running) {
                    global.requestAnimationFrame(step);
                }
            };

        this.debug = opts.debug || false;
        if (this.debug) {
            global.Dragon = this;
        }

        pipeline.load(opts, function () {
            if (!running) {
                running = true;
                global.requestAnimationFrame(step);
            }
        });
    },
    kill: function () {
        running = false;
        screens.forEach(function (screen) {
            screen.stop();
        });
    },
    update: function () {
        var addQueue;

        masks.update();

        // Update the screen.
        screens.forEach(function (screen) {
            if (screen.updating) {
                screen.update();
            }
        });

        // Settle screen tap events.
        dragonCollisions.handleCollisions();

        if (screensToAdd.length) {
            addQueue = screensToAdd;
            screensToAdd = [];
            // Update the master screen list after updates.
            addQueue.forEach(function (screen) {
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
        }
    },
    draw: function () {
        screens.forEach(function (screen) {
            if (screen.drawing) {
                screen.draw(ctx);
            }
        });
        if (this.debug) {
            FrameCounter.draw(ctx);
            dragonCollisions.draw(ctx);
        }
    },
    teardown: function () {
        dragonCollisions.teardown();
        masks.teardown();

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
