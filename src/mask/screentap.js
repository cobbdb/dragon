var Collidable = require('../collidable.js'),
    Point = require('../geom/point.js'),
    Vector = require('../geom/vector.js'),
    Mouse = require('../io/mouse.js'),
    dragonCollisions = require('../dragon-collisions.js'),
    Rectangle = require('../geom/rectangle.js'),
    tapped = false,
    reset = false,
    safePos = Point(-999, -999);

/**
 * @class ScreenTap
 * @extends Collidable
 */
module.exports = Collidable({
    name: 'screentap',
    mask: Rectangle(safePos.x, safePos.y, 12, 12),
    collisions: dragonCollisions,
    offset: Vector(-6, -6)
}).extend({
    update: function () {
        if (tapped && !reset) {
            reset = true;
            this.move(safePos);
        } else if (!tapped && Mouse.is.down) {
            tapped = true;
            reset = false;
            this.move(Mouse.offset);
        } else if (tapped && Mouse.is.up) {
            tapped = false;
        }
        this.base.update();
    }
});
