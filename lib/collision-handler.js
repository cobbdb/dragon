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
                        /**
                         * --> There has -got- to be a better way
                         *     to do this.
                         */
                        if (pivot.intersects(other)) {
                            if (!pivot.isCollidingWith(other.id)) {
                                pivot.collideWith(other);
                                other.collideWith(pivot);
                            } else {
                                pivot.removeCollision(other.instanceId);
                                other.removeCollision(pivot.instanceId);
                            }
                        }
                    });
                });
            });
        }
    };
};
