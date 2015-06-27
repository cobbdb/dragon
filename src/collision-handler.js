/**
 * @param {String} opts.name
 */
module.exports = function (opts) {
    /**
     * @type {Array Of CollisionItem}
     */
    var activeCollisions = [];

    return {
        name: opts.name,
        draw: function (ctx) {
            activeCollisions.forEach(function (collidable) {
                collidable.mask.draw(ctx);
            });
        },
        clearCollisions: function () {
            activeCollisions = [];
        },
        update: function (collidable) {
            activeCollisions.push(collidable);
        },
        handleCollisions: function () {
            activeCollisions.forEach(function (pivot) {
                activeCollisions.forEach(function (other) {
                    var intersects, colliding,
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
                                pivot.trigger('collide#' + other.name, other);
                                pivot.trigger('collide.' + other.kind, other);
                            }
                            pivot.trigger('colliding#' + other.name, other);
                            pivot.trigger('colliding.' + other.kind, other);
                        } else {
                            pivot.removeCollision(other.id);
                            if (colliding) {
                                pivot.trigger('separate#' + other.name, other);
                                pivot.trigger('separate.' + other.kind, other);
                            }
                            pivot.trigger('miss#' + other.name, other);
                            pivot.trigger('miss.' + other.kind, other);
                        }
                    }
                });
            });
        },
        teardown: function () {
            this.clearCollisions();
        }
    };
};
