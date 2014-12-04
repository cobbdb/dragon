var counter = require('./id-counter.js'),
    EventHandler = require('./event-handler.js'),
    BaseClass = require('baseclassjs'),
    Rectangle = require('./rectangle.js');

/**
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} opts.name
 * @param {Array|CollisionHandler} [opts.collisionSets]
 */
module.exports = function (opts) {
    var instanceId = counter.nextId,
        activeCollisions = {},
        collisionSets = [].concat(opts.collisionSets);

    return BaseClass({
        get id () {
            return instanceId;
        },
        get name () {
            return opts.name;
        },
        mask: opts.mask || Rectangle(),
        move: function (x, y) {
            this.mask.move(x, y);
        },
        intersects: function (mask) {
            return this.mask.intersects(mask);
        },
        update: function () {
            collisionSets.forEach(function (handler) {
                handler.update(this.leaf);
            });
        },
        addCollision: function (id) {
            if (id !== instanceId) {
                activeCollisions[id] = true;
            }
        },
        removeCollision: function (id) {
            activeCollisions[id] = false;
        },
        isCollidingWith: function (id) {
            // Return type is always boolean.
            return activeCollisions[id] || false;
        }
    }).implement(
        EventHandler()
    );
};
