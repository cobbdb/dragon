var Collection = require('./collection.js'),
    CollisionItem = require('./collision-item.js'),
    Rectangle = require('./geom/rectangle.js'),
    Point = require('./geom/point.js'),
    Dimension = require('./geom/dimension.js'),
    canvas = require('./io/canvas.js'),
    dragonCollisions = require('./dragon-collisions.js');

module.exports = Collection({
    name: '$:masks'
}).add([
    require('./mask/screentap.js'),
    require('./mask/screendrag.js'),
    require('./mask/screenhold.js'),
    CollisionItem({
        name: 'screenedge/top',
        mask: Rectangle(
            Point(0, -20),
            Dimension(canvas.width, 20)
        ),
        collisionSets: dragonCollisions
    }),
    CollisionItem({
        name: 'screenedge/right',
        mask: Rectangle(
            Point(canvas.width, 0),
            Dimension(20, canvas.height)
        ),
        collisionSets: dragonCollisions
    }),
    CollisionItem({
        name: 'screenedge/bottom',
        mask: Rectangle(
            Point(0, canvas.height),
            Dimension(canvas.width, 20)
        ),
        collisionSets: dragonCollisions
    }),
    CollisionItem({
        name: 'screenedge/left',
        mask: Rectangle(
            Point(-20, 0),
            Dimension(20, canvas.height)
        ),
        collisionSets: dragonCollisions
    })
]);
