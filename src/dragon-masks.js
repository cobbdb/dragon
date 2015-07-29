var Collection = require('./collection.js'),
    Collidable = require('./collidable.js'),
    Rectangle = require('./geom/rectangle.js'),
    Point = require('./geom/point.js'),
    Dimension = require('./geom/dimension.js'),
    canvas = require('./io/canvas.js'),
    dragonCollisions = require('./dragon-collisions.js');

module.exports = Collection({
    name: '$:masks',
    sorted: false
}).add([
    require('./mask/screentap.js'),
    require('./mask/screendrag.js'),
    require('./mask/screenhold.js'),
    Collidable({
        name: 'screenedge/top',
        mask: Rectangle(0, -20, canvas.width, 20),
        collisions: dragonCollisions
    }),
    Collidable({
        name: 'screenedge/right',
        mask: Rectangle(canvas.width, 0, 20, canvas.height),
        collisions: dragonCollisions
    }),
    Collidable({
        name: 'screenedge/bottom',
        mask: Rectangle(0, canvas.height, canvas.width, 20),
        collisions: dragonCollisions
    }),
    Collidable({
        name: 'screenedge/left',
        mask: Rectangle(-20, 0, 20, canvas.height),
        collisions: dragonCollisions
    })
]);
