var BaseClass = require('baseclassjs'),
    _ = require('lodash'),
    counter = require('./id-counter.js');

/**
 * @param opts.mask,
 * @param opts.collisionSets
 */
module.exports = function (opts) {
    var instanceId = counter.nextId,
        collisionList = [];

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
            opts.collisionSets.forEach(function (handler) {
                handler.update(this.leaf);
            });
        },
        collideWith: function (other) {
            // Cannot collide with self.
            if (other.id !== instanceId) {
                collisionList.push(other.id);
                other.collisionList
            }
        },
        removeCollision: function (otherId) {
            collisionList = collisionList.filter(function (id) {
                return otherId !== id;
            });
        },
        isCollidingWith: function (id) {
            return collisionList.indexOf(id) >= 0;
        }
    });
};
