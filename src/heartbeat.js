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
     * Start the game after assets are done loading.
     * @param {Array|Screen} screens
     * @param {Boolean} debugMode
     */
    start: function (screens, debugMode) {
        var hash;
        Game.debug = debugMode;

        if (!running) {
            running = true;
            hash = global.setInterval(function () {
                if (pipeline.ready) {
                    global.clearInterval(hash);
                    Game.addScreens(screens);
                    run();
                }
            }, 500);
        }
    }
};
