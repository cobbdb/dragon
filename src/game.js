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

/**
 * Start the heartbeat of the engine.
 */
function run() {
    function step() {
        update();
        draw();
        teardown();
        FrameCounter.countFrame();
        global.requestAnimationFrame(step);
    }
    global.requestAnimationFrame(step);
}

/**
 * Resolve pre-draw logic.
 */
function update() {
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
}
/**
 * Resolve draw events.
 */
function draw() {
    screens.forEach(function (screen) {
        if (screen.drawing) {
            screen.draw(ctx);
        }
    });
    if (this.debug) {
        FrameCounter.draw(ctx);
        dragonCollisions.draw(ctx);
    }
}
/**
 * Resolve post-draw events.
 */
function teardown() {
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

module.exports = {
    /**
     * @type {Boolean}
     */
    debug: false,
    /**
     * @param {String} name
     * @return {Screen}
     */
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
     * Check if assets are done loading then start the engine.
     * @param {Boolean} debugMode
     */
    start: function (debugMode) {
        var hash;
        if (!running) {
            running = true;
            hash = global.setInterval(function () {
                if (pipeline.ready) {
                    run();
                    global.clearInterval(hash);
                }
            }, 500);
        }
        this.debug = debugMode || false;
    }
};
