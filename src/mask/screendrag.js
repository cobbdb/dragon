var CollisionItem = require('../collision-item.js'),
    Point = require('../geom/point.js'),
    Vector = require('../geom/vector.js'),
    Mouse = require('../io/mouse.js'),
    dragonCollisions = require('../dragon-collisions.js'),
    Rectangle = require('../geom/rectangle.js'),
    Dimension = require('../geom/dimension.js'),
    reset = false,
    safePos = Point(-999, -999);

/**
 * @class ScreenDrag
 * @extends CollisionItem
 */
module.exports = CollisionItem({
    name: 'screendrag',
    mask: Rectangle(safePos, Dimension(12, 12)),
    collisions: dragonCollisions,
    offset: Vector(-6, -6)
}).extend({
    update: function () {
        if (Mouse.is.dragging) {
            reset = false;
            this.move(Mouse.offset);
        } else if (!reset) {
            reset = true;
            this.move(safePos);
        }
        this.base.update();
    }
});
