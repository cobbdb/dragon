var Rectangle = require('./rectangle.js'),
    Dimension = require('./dimension.js');

/**
 * @param {String} opts.name
 * @param {Dimension} [opts.gridSize] Defaults to (1,1).
 * @param {Dimension} opts.canvasSize Dimension of the game canvas.
 */
module.exports = function (opts) {
    var i, j, len,
        collisionGrid = [],
        activeCollisions = [],
        gridSize = opts.gridSize || Dimension(1, 1);

    for (i = 0; i < gridSize.x; i += 1) {
        for (j = 0; j < gridSize.y; j += 1) {
            collisionGrid.push(
                Rectangle(
                    i / gridSize.x * opts.canvasSize.width,
                    j / gridSize.y * opts.canvasSize.height,
                    opts.canvasSize.width / gridSize.x,
                    opts.canvasSize.height / gridSize.y
                )
            );
        }
    }

    len = collisionGrid.length;
    for (i = 0; i < len; i += 1) {
        activeCollisions.push([]);
    }

    return {
        name: opts.name,
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
            var i, set,
                len = activeCollisions.length;

            for (i = 0; i < len; i += 1) {
                set = activeCollisions[i];
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
                // Clear the collision set after it's been processed.
                activeCollisions[i] = [];
            }
        }
    };
};
