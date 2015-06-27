var CollisionItem = require('../collision-item.js'),
    Circle = require('../geom/circle.js'),
    Point = require('../geom/point.js'),
    Mouse = require('../io/mouse.js'),
    dragonCollisions = require('../dragon-collisions.js'),
    tapping = false;

Mouse.on.down(function () {
    tapping = true;
});

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
        if (tapping) {
            tapping = false;
            this.move(Mouse.offset);
        } else {
            this.move(
                Point(-999, -999)
            );
        }
        this.base.update();
    }
});
