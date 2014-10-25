var BaseClass = require('baseclassjs'),
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
        intersects: function (mask) {
            return this.mask.intersects(mask);
        },
        update: function () {
            collisionSets.forEach(function (handler) {
                handler.update(this.leaf);
            });
        },
        collide: BaseClass.Stub,
        colliding: BaseClass.Stub,
        separate: BaseClass.Stub,
        miss: BaseClass.Stub,
        trigger: function (name, other) {
            // other.something.something[name](this.leaf); ... kinda like that
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
