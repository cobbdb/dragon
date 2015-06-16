var Collection = require('./collection.js'),
    CollisionItem = require('./collision-item.js'),
    Rectangle = require('./geom/rectangle.js'),
    Point = require('./geom/point.js'),
    Dimension = require('./geom/dimension.js'),
    canvas = require('./io/canvas.js'),
    dragonCollisions = require('./dragon-collisions.js');

module.exports = Collection().add([
    require('./mask/screentap.js'),
    require('./mask/screendrag.js'),
    require('./mask/screenhold.js'),
    CollisionItem({
        name: 'screenedge/top',
        mask: Rectangle(
            Point(0, -9),
            Dimension(canvas.width, 10)
        ),
        collisionSets: dragonCollisions
    }),
    CollisionItem({
        name: 'screenedge/right',
        mask: Rectangle(
            Point(canvas.width - 1, 0),
            Dimension(10, canvas.height)
        ),
        collisionSets: dragonCollisions
    }),
    CollisionItem({
        name: 'screenedge/bottom',
        mask: Rectangle(
            Point(0, canvas.height - 1),
            Dimension(canvas.width, 10)
        ),
        collisionSets: dragonCollisions
    }),
    CollisionItem({
        name: 'screenedge/left',
        mask: Rectangle(
            Point(-9, 0),
            Dimension(10, canvas.height)
        ),
        collisionSets: dragonCollisions
    })
]);
