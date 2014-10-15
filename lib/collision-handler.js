var Rectangle = require('./rectangle.js');

/**
 * Add new handler with
 * game.addCollisionSet('playerVsEnemies', Dimension(4, 3));
 * .. then reference like ..
 * badGuy = Sprite({
 *      collisionSet: [
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
        i, j;

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

    for (i = 0; i < collisionGrid.length; i += 1) {
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
                        if (pivot === other) {
                            // Don't allow sprites to collide with themselves.
                            continue;
                        }

                        otherSprite = activeCollisions[i][other];

                        // check for collision
                        if (pivotSprite.intersects(otherSprite)) {
                            // only collide if not already -> fix for seizure effect
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
                                pivotSprite.collideWith(otherSprite);

                                // record the collision
                                /**
                                 * --> This add/remove collision work can and should
                                 *     be done in the sprite's collide method.
                                 */
                                /**
                                 * --> Adjust the verbage here, this isn't
                                 *     descriptive enough and is almost
                                 *     misleading.
                                 */
                                pivotSprite.addCollision(otherSprite.instanceId);
                                otherSprite.addCollision(pivotSprite.instanceId);
                            } else {
                                // remove any existing collision
                                /**
                                 * --> Why remove existing ids here? This is a very
                                 *     odd place to do this work. Instead, shouldn't
                                 *     this data be wiped at the start of each call
                                 *     to the sprite's update method? Seems like this
                                 *     should only be cleared away once per update.
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
