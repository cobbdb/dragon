var Game = require('./game.js'),
    pipeline = require('./assets/pipeline.js'),
    running = false;

/**
 * Start the heartbeat of the engine.
 */
function run() {
    function step() {
        Game.update();
        Game.draw();
        Game.teardown();
        FrameCounter.countFrame();
        global.requestAnimationFrame(step);
    }
    global.requestAnimationFrame(step);
}

/**
 * @class Heartbeat
 */
module.exports = {
    /**
     * Check if assets are done loading then start the engine.
     * @param {Boolean} debugMode
     */
    start: function (debugMode) {
        var hash;
        Game.debug = debugMode;

        if (!running) {
            running = true;
            hash = global.setInterval(function () {
                if (pipeline.ready) {
                    global.clearInterval(hash);
                    Game.load();
                    run();
                }
            }, 500);
        }
    }
};
