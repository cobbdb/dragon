var FrameCounter = require('./util/frame-counter.js'),
    Collection = require('./collection.js'),
    ctx = require('./io/canvas.js').ctx,
    collisions = require('./dragon-collisions.js'),
    masks = require('./dragon-masks.js');

/**
 * @class Game
 * @extends Collection
 */
module.exports = Collection({
    name: 'dragon-game'
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
    },
    update: function () {
        masks.update();
        this.base.update();
        // Settle screen tap events.
        collisions.handleCollisions();
    },
    draw: function () {
        this.base.draw(ctx);
        if (this.debug) {
            FrameCounter.draw(ctx);
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
        return this.base.get(name);
    },
    /**
     * @param {Array|Screen} set
     */
    addScreens: function (set) {
        this.base.add(set);
    },
    /**
     * @param {Screen} screen
     */
    removeScreen: function (screen) {
        this.base.remove(screen);
    }
});
