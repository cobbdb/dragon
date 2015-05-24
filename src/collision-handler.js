/**
 * @param {String} opts.name
 */
module.exports = function (opts) {
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
                        intersects = pivot.intersects(other.mask),
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
                                pivot.trigger('collide/' + other.name, other);
                            }
                            pivot.trigger('colliding/' + other.name, other);
                        } else {
                            if (colliding) {
                                pivot.removeCollision(other.id);
                                pivot.trigger('separate/' + other.name, other);
                            }
                            pivot.trigger('miss/' + other.name, other);
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
