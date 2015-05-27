var Collection = require('./collection.js'),
    Collidable = require('./collidable.js'),
    Rectangle = require('./rectangle.js'),
    Point = require('./point.js'),
    Dimension = require('./dimension.js'),
    canvas = require('./canvas.js'),
    dragonCollisions = require('./dragon-collisions.js');

module.exports = Collection().add([
    require('./mask-screentap.js'),
    require('./mask-screendrag.js'),
    require('./mask-screenhold.js'),
    Collidable({
        name: 'screenedge/top',
        mask: Rectangle(
            Point(0, -9),
            Dimension(canvas.width, 10)
        ),
        collisionSets: dragonCollisions
    }),
    Collidable({
        name: 'screenedge/right',
        mask: Rectangle(
            Point(canvas.width - 1, 0),
            Dimension(10, canvas.height)
        ),
        collisionSets: dragonCollisions
    }),
    Collidable({
        name: 'screenedge/bottom',
        mask: Rectangle(
            Point(0, canvas.height - 1),
            Dimension(canvas.width, 10)
        ),
        collisionSets: dragonCollisions
    }),
    Collidable({
        name: 'screenedge/left',
        mask: Rectangle(
            Point(-9, 0),
            Dimension(10, canvas.height)
        ),
        collisionSets: dragonCollisions
    })
]);
