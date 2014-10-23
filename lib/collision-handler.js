var Rectangle = require('./rectangle.js');

/**
 * Add new handler with
 * game.addCollisionSet('playerVsEnemies', Dimension(4, 3));
 * .. then reference like ..
 * badGuy = Sprite({
 *      collisions: [
 *          game.collisionSet.playerVsEnemies,
 *          game.collisionSet.otherStuff
 *      ],
 *      ..
 * });
 */
module.exports = function (gridSize, collide, screen) {
    var collisionGrid = [],
        activeCollisions = [],
        i, j, len;

    for (i = 0; i < gridSize.x; i += 1) {
        for (j = 0; j < gridSize.y; j += 1) {
            collisionGrid.push(
                Rectangle(
                    i / gridSize.x * screen.width,
                    j / gridSize.y * screen.height,
                    screen.width / gridSize.x,
                    screen.height / gridSize.y
                )
            );
        }
    }

    len = collisionGrid.length;
    for (i = 0; i < len; i += 1) {
        activeCollisions.push([]);
    }

    return {
        clearCollisions: function () {
            var i, len = activeCollisions.length;
            for (i = 0; i < len; i += 1) {
                activeCollisions[i] = [];
            }
        },
        update: function (collidable) {
            var i, len = activeCollisions.length;
            for (i = 0; i < len; i += 1) {
                if (collidable.mask.intersects(collisionGrid[i])) {
                    activeCollisions[i].push(collidable);
                }
            }
        },
        handleCollisions: function () {
            activeCollisions.forEach(function (set) {
                set.forEach(function (pivot) {
                    set.forEach(function (other) {
                        var intersects = pivot.intersects(other),
                            colliding = pivot.isCollidingWith(other.id);
                        /**
                         *  (colliding) ongoing intersection
                         *  (collide) first collided: no collide -> colliding
                         *  (separate) first separated: colliding -> no collide
                         *  (miss) ongoing separation
                         */
                        if (intersects) {
                            pivot.colliding(other);
                            other.colliding(pivot);
                            if (!colliding) {
                                pivot.collide(other);
                                other.collide(pivot);

                                pivot.addCollision(other.id);
                                other.addCollision(pivot.id);
                            }
                        } else {
                            pivot.miss(other);
                            other.miss(pivot);
                            if (colliding) {
                                pivot.separate(other);
                                other.separate(pivot);

                                pivot.removeCollision(other.id);
                                other.removeCollision(pivot.id);
                            }
                        }
                    });
                });
            });
        }
    };
};
