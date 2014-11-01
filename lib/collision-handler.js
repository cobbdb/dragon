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
module.exports = function (gridSize, collide, canvas) {
    var collisionGrid = [],
        activeCollisions = [],
        i, j, len;

    for (i = 0; i < gridSize.x; i += 1) {
        for (j = 0; j < gridSize.y; j += 1) {
            collisionGrid.push(
                Rectangle(
                    i / gridSize.x * canvas.width,
                    j / gridSize.y * canvas.height,
                    canvas.width / gridSize.x,
                    canvas.height / gridSize.y
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
                if (collidable.intersects(collisionGrid[i])) {
                    activeCollisions[i].push(collidable);
                }
            }
        },
        handleCollisions: function () {
            activeCollisions.forEach(function (set) {
                set.forEach(function (pivot) {
                    set.forEach(function (other) {
                        var intersects = pivot.intersects(other.mask),
                            colliding = pivot.isCollidingWith(other.id);
                        /**
                         *  (colliding) ongoing intersection
                         *  (collide) first collided: no collide -> colliding
                         *  (separate) first separated: colliding -> no collide
                         *  (miss) ongoing separation
                         */
                        if (intersects) {
                            if (!colliding) {
                                pivot.trigger('collide/' + other.name, other);
                                pivot.addCollision(other.id);
                            }
                            pivot.trigger('colliding/' + other.name, other);
                        } else {
                            if (colliding) {
                                pivot.trigger('separate/' + other.name, other);
                                pivot.removeCollision(other.id);
                            }
                            pivot.trigger('miss/' + other.name, other);
                        }
                    });
                });
            });
        }
    };
};
