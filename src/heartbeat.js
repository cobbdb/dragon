var Game = require('./game.js'),
    frameCounter = require('./util/frame-counter.js'),
    running = false;

/**
 * @class Heartbeat
 */
module.exports = {
    /**
     * Start the heartbeat of the engine.
     */
    run: function () {
        if (!running) {
            running = true;
            function step() {
                Game.update();
                Game.draw();
                Game.teardown();
                frameCounter.countFrame();
                global.requestAnimationFrame(step);
            }
            global.requestAnimationFrame(step);
        }
    }
};
