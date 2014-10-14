var Rectangle = require('./rectangle.js');

// --> this whole thing is just.. yikes
module.exports = function (partitionConf, collide, screen) {
    var collisionBoundsList = [],
        collisionLists = [],
        i, j;

    for (i = 0; i < partitionConf.x; i += 1) {
        for (j = 0; j < partitionConf.y; j += 1) {
            collisionBoundsList.push(
                Rectangle(
                    i / partitionConf.x * screen.width,
                    j / partitionConf.y * screen.height,
                    screen.width / partitionConf.x,
                    screen.height / partitionConf.y
                )
            );
        }
    }

    for (i = 0; i < collisionBoundsList.length; i += 1) {
        collisionLists.push([]);
    }

    return {
        clearCollisions: function () {
            var i, len = collisionLists.length;
            for (i = 0; i < len; i += 1) {
                collisionLists[i] = [];
            }
        },
        update: function (item) {
            var i, len = collisionLists.length,
                itemBounds = item.mask;
            for (i = 0; i < len; i += 1) {
                if (itemBounds.intersects(collisionBoundsList[i])) {
                    collisionLists[i].push(item);
                }
            }
        },
        handleCollisions: function () {
            var i, pivot, other, pivotSprite, otherSprite;
            for (i = 0; i < collisionLists.length; i += 1) {
                for (pivot = 0; pivot < collisionLists[i].length; pivot += 1) {
                    pivotSprite = collisionLists[i][pivot];
                    for (other = 0; other < collisionLists[i].length; other += 1) {
                        if (pivot === other) {
                            // Don't allow sprites to collide with themselves.
                            continue;
                        }

                        otherSprite = collisionLists[i][other];

                        // check for collision
                        if (pivotSprite.intersects(otherSprite)) {
                            // only collide if not already -> fix for seizure effect
                            if (
                                !pivotSprite.isCollidingWith(otherSprite.instanceId) &&
                                !otherSprite.isCollidingWith(pivotSprite.instanceId)
                            ) {
                                // do the collision
                                collide(pivotSprite, otherSprite);

                                // record the collision
                                pivotSprite.addCollision(otherSprite.instanceId);
                                otherSprite.addCollision(pivotSprite.instanceId);
                            } else {
                                // remove any existing collision
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
