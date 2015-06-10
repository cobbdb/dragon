var Collidable = require('./collidable.js'),
    Circle = require('./circle.js'),
    Point = require('./point.js'),
    Mouse = require('./mouse.js'),
    dragonCollisions = require('./dragon-collisions.js');

module.exports = Collidable({
    name: 'screenhold',
    mask: Circle(Point(), 8),
    collisionSets: dragonCollisions
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