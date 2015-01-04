var Counter = require('./id-counter.js'),
    EventHandler = require('./event-handler.js'),
    BaseClass = require('baseclassjs'),
    Rectangle = require('./rectangle.js'),
    Point = require('./point.js');

/**
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} opts.name
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {Object} [opts.on] Dictionary of events.
 * @param {Object} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var activeCollisions = {},
        collisionSets = [],
        updated = false;

    if (opts.collisionSets) {
        collisionSets = [].concat(opts.collisionSets);
    }

    return BaseClass({
        id: Counter.nextId,
        name: opts.name,
        mask: opts.mask || Rectangle(),
        offset: opts.offset || Point(),
        move: function (pos) {
            this.mask.move(
                pos.x + this.offset.x,
                pos.y + this.offset.y
            );
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
        clearCollisions: function () {
            activeCollisions = {};
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
