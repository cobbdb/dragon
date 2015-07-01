var Game = require('./game.js'),
    pipeline = require('./assets/pipeline.js'),
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
                FrameCounter.countFrame();
                global.requestAnimationFrame(step);
            }
            global.requestAnimationFrame(step);
        }
    }
};
