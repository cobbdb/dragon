var Util = require('./util/object.js'),
    Item = require('./item.js');

/**
 * @class CollisionHandler
 * @extends Item
 * @param {String} [opts.name]
 */
module.exports = function (opts) {
    /**
     * @type {Array Of CollisionItem}
     */
    var activeCollisions = [];

    opts = Util.mergeDefaults(opts, {
        name: '$:collision-handler',
        kind: '$:collision-handler'
    });

    return Item(opts).extend({
        draw: function (ctx) {
            var i, len = activeCollisions.length;
            for (i = 0; i < len; i += 1) {
                activeCollisions[i].mask.draw(ctx);
            }
        },
        clearCollisions: function () {
            activeCollisions = [];
        },
        update: function (item) {
            activeCollisions.push(item);
        },
        handleCollisions: function () {
            var i, j, len,
                pivot, other,
                intersects, colliding, valid;

            len = activeCollisions.length;
            for (i = 0; i < len; i += 1) {
                pivot = activeCollisions[i];
                for (j = 0; j < len; j += 1) {
                    other = activeCollisions[j];
                    valid = pivot.canCollideWith(other.id);

                    if (valid) {
                        intersects = pivot.intersects(other.mask);
                        colliding = pivot.isCollidingWith(other.id);
                        /**
                         * (colliding) ongoing intersection
                         * (collide) first collided: no collide -> colliding
                         * (separate) first separated: colliding -> no collide
                         * (miss) ongoing separation
                         */
                        if (intersects) {
                            pivot.addCollision(other.id);
                            if (!colliding) {
                                pivot.trigger('$collide#' + other.name, other);
                                pivot.trigger('$collide.' + other.kind, other);
                            }
                            pivot.trigger('$colliding#' + other.name, other);
                            pivot.trigger('$colliding.' + other.kind, other);
                        } else {
                            pivot.removeCollision(other.id);
                            if (colliding) {
                                pivot.trigger('$separate#' + other.name, other);
                                pivot.trigger('$separate.' + other.kind, other);
                            }
                            pivot.trigger('$miss#' + other.name, other);
                            pivot.trigger('$miss.' + other.kind, other);
                        }
                    }
                }
            }
        },
        teardown: function () {
            this.clearCollisions();
        }
    });
};
