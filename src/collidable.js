var Counter = require('./id-counter.js'),
    EventHandler = require('./event-handler.js'),
    BaseClass = require('baseclassjs'),
    Rectangle = require('./rectangle.js');

/**
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} opts.name
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {Object} [opts.on] Dictionary of events.
 * @param {Object} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var instanceId = Counter.nextId,
        activeCollisions = {},
        collisionSets = [],
        updated = false;

    if (opts.collisionSets) {
        collisionSets = collisionSets.concat(opts.collisionSets);
    }

    return BaseClass({
        id: instanceId,
        name: opts.name,
        mask: opts.mask || Rectangle(),
        move: function (x, y) {
            this.mask.move(x, y);
        },
        intersects: function (mask) {
            return this.mask.intersects(mask);
        },
        update: function () {
            var that = this;
            if (!updated) {
                collisionSets.forEach(function (handler) {
                    handler.update(that);
                });
                updated = true;
            }
        },
        teardown: function () {
            updated = false;
        },
        addCollision: function (id) {
            activeCollisions[id] = true;
        },
        removeCollision: function (id) {
            activeCollisions[id] = false;
        },
        isCollidingWith: function (id) {
            // Return type is always boolean.
            return activeCollisions[id] || false;
        }
    }).implement(
        EventHandler({
            events: opts.on,
            singles: opts.one
        })
    );
};
