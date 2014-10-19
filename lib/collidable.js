var BaseClass = require('baseclassjs'),
    _ = require('lodash');

/**
 * @param opts.mask,
 * @param opts.collisionSets,
 * @param opts.handlers
 */
module.exports = function (opts) {
    var instanceId = opts.id,
        collisionList = [];

    return {
        extend: BaseClass,
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
            // Clear the collision list on every update.
            collisionList = [];
            opts.collisionSets.forEach(function (handler) {
                handler.update(this.leaf);
            });
        },
        collideWith: opts.handlers,
        collideWith: function (id) {
            if (id !== instanceId) {
                // Cannot collide with self.
                collisionList.push(id);
            }
        },
        isCollidingWith: function (id) {
            return _.contains(collisionList, id);
        }
    };
};
