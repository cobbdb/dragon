var BaseClass = require('baseclassjs'),
    _ = require('lodash'),
    counter = require('./id-counter.js');

/**
 * @param opts.mask,
 * @param opts.collisionSets
 */
module.exports = function (opts) {
    var instanceId = counter.nextId,
        activeCollisions = {},
        collisionSets = opts.collisionSets || [];

    return BaseClass({
        get id () {
            return instanceId;
        },
        mask: opts.mask,
        move: function (x, y) {
            this.mask.move(x, y);
        },
        intersects: function (other) {
            return this.mask.intersects(other.mask);
        },
        update: function () {
            collisionSets.forEach(function (handler) {
                handler.update(this.leaf);
            });
        },
        on: {
            collide: BaseClass.Stub,
            colliding: BaseClass.Stub,
            separate: BaseClass.Stub,
            miss: BaseClass.Stub
        },
        collideWith: function (other) {
            // Cannot collide with self.
            if (other.id !== instanceId) {
                activeCollisions[other.id] = true;
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
