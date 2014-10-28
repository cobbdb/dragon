var counter = require('./id-counter.js'),
    EventHandler = require('./event-handler.js'),
    BaseClass = require('baseclassjs');

/**
 * @param opts.mask
 * @param opts.name
 * @param opts.collisionSets
 */
module.exports = function (opts) {
    var instanceId = counter.nextId,
        activeCollisions = {},
        collisionSets = opts.collisionSets || [],
        name = opts.name;

    return EventHandler().extend({
        get id () {
            return instanceId;
        },
        get name () {
            return name;
        },
        mask: opts.mask,
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
            return activeCollisions[id] ? true : false;
        }
    });
};
