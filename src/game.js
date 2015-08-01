var frameCounter = require('./util/frame-counter.js'),
    Collection = require('./collection.js'),
    timer = require('./util/timer.js'),
    ctx = require('./io/canvas.js').ctx,
    collisions = require('./dragon-collisions.js'),
    masks = require('./dragon-masks.js');

/**
 * @class Game
 * @extends Collection
 */
module.exports = Collection({
    name: '$:game'
}).extend({
    /**
     * @type {Boolean}
     */
    debug: false,
    /**
     * Enable debug mode.
     */
    useDebug: function () {
        this.debug = true;
        frameCounter.start();
    },
    update: function () {
        masks.update();
        this.base.update();
        timer.update();
        // Settle screen tap events.
        collisions.handleCollisions();
    },
    draw: function () {
        this.base.draw(ctx);
        if (this.debug) {
            frameCounter.draw(ctx);
            collisions.draw(ctx);
        }
    },
    teardown: function () {
        collisions.teardown();
        masks.teardown();
        this.base.teardown();
    },
    /**
     * @param {String} name
     * @return {Screen}
     */
    screen: function (name) {
        return this.map[name];
    },
    /**
     * @param {Array|Screen} set
     */
    addScreens: function (set) {
        this.base.add(set);
    },
    /**
     * @param {String} name
     */
    removeScreen: function (name) {
        var screen = this.map[name];
        this.base.remove(screen);
    }
});
