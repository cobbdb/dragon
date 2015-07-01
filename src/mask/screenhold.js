var CollisionItem = require('../collision-item.js'),
    Circle = require('../geom/circle.js'),
    Point = require('../geom/point.js'),
    Mouse = require('../io/mouse.js'),
    dragonCollisions = require('../dragon-collisions.js');

/**
 * @class ScreenHold
 * @extends CollisionItem
 */
module.exports = CollisionItem({
    name: 'screenhold',
    mask: Circle(Point(), 8),
    collisions: dragonCollisions
}).extend({
    update: function () {
        if (Mouse.is.down && !Mouse.is.dragging) {
            this.move(Mouse.offset);
        } else {
            this.move(
                Point(-999, -999)
            );
        }
        this.base.update();
    }
});
