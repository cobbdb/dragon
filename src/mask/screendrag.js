var CollisionItem = require('../collision-item.js'),
    Circle = require('../geom/circle.js'),
    Point = require('../geom/point.js'),
    Mouse = require('../io/mouse.js'),
    dragonCollisions = require('../dragon-collisions.js');

/**
 * @class ScreenDrag
 * @extends CollisionItem
 */
module.exports = CollisionItem({
    name: 'screendrag',
    mask: Circle(Point(), 8),
    collisionSets: dragonCollisions,
    updating: false,
    drawing: false
}).extend({
    update: function () {
        this.move(Mouse.offset);
        this.base.update();
    }
});

Mouse.on.drag(function () {
    this.start();
}, module.exports);
Mouse.on.up(function () {
    this.stop();
}, module.exports);
