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
// --> Figure out how to remove the central 'collide' method.
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
        update: function (item) {
            var i, len = activeCollisions.length;
            for (i = 0; i < len; i += 1) {
                if (item.intersects(collisionGrid[i])) {
                    activeCollisions[i].push(item);
                }
            }
        },
        // --> This needs cleanup
        handleCollisions: function () {
            var i, pivot, other, pivotSprite, otherSprite;
            // --> Evaluate the next 5 lines for any cleanup possible.
            for (i = 0; i < activeCollisions.length; i += 1) {
                for (pivot = 0; pivot < activeCollisions[i].length; pivot += 1) {
                    pivotSprite = activeCollisions[i][pivot];
                    for (other = 0; other < activeCollisions[i].length; other += 1) {
                        // Don't allow sprites to collide with themselves.
                        /**
                         * --> While this seems clean, compilers cannot optimize
                         *     well over continue statements like this.
                         * --> Consider an alternative to just continuing.
                         */
                        if (pivot === other) {
                            continue;
                        }

                        otherSprite = activeCollisions[i][other];

                        if (pivotSprite.intersects(otherSprite)) {
                            // only collide if not already -> fix for 'jitter' effect
                            /**
                             * --> Consider performance impact here.. also this is
                             *     very ugly.
                             * --> Think about some alternatives to this.
                             */
                            if (
                                !pivotSprite.isCollidingWith(otherSprite.instanceId) &&
                                !otherSprite.isCollidingWith(pivotSprite.instanceId)
                            ) {
                                // do the collision
                                /**
                                 * --> I don't like that there is one central hub for all
                                 *     collisions. These rules should be nested inside of
                                 *     each sprite and not mashed together.
                                 */
                                //collide(pivotSprite, otherSprite);
                                // --> Something like this, instead.
                                /**
                                 * --> I'm not totally sold on calling for collisions in
                                 *     duplicate every time.
                                 * --> Think about some alternatives.
                                 */
                                pivotSprite.collideWith(otherSprite);
                                otherSprite.collideWith(pivotSprite);

                                // --> Moved into Sprite.collideWith()
                                //pivotSprite.addCollision(otherSprite.instanceId);
                                //otherSprite.addCollision(pivotSprite.instanceId);
                            } else {
                                // remove any existing collision
                                /**
                                 * --> This removal is done to avoid Sprites that
                                 *     overlap across multiple frames - meaning, cannot
                                 *     just wipe clean before ever update.
                                 * --> Fixes 'jitter' effect.
                                 * --> Find a better way to do this.
                                 */
                                pivotSprite.removeCollision(otherSprite.instanceId);
                                otherSprite.removeCollision(pivotSprite.instanceId);
                            }
                        }
                    }
                }
            }
        }
    };
};
