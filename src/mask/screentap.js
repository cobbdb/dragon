var CollisionItem = require('../collision-item.js'),
    Circle = require('../geom/circle.js'),
    Point = require('../geom/point.js'),
    Mouse = require('../io/mouse.js'),
    dragonCollisions = require('../dragon-collisions.js');

/**
 * @class ScreenTap
 * @extends CollisionItem
 */
module.exports = CollisionItem({
    name: 'screentap',
    mask: Circle(Point(), 8),
    collisionSets: dragonCollisions
}).extend({
    update: function () {
        this.move(Mouse.offset);
        this.base.update();
    },
    teardown: function () {
        this.base.teardown();
        this.stop();
    }
});

Mouse.on.down(function () {
    this.start();
}, module.exports);
