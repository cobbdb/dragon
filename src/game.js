var FrameCounter = require('./util/frame-counter.js'),
    ctx = require('./io/canvas.js').ctx,
    collisions = require('./dragon-collisions.js'),
    masks = require('./dragon-masks.js');

module.exports = Collection({
    name: 'dragon-game'
}).extend({
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
     * @type {Boolean}
     */
    debug: false,
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
     * @param {String} name
     */
    removeScreen: function (name) {
        this.base.remove(name);
    }
});
