var Collidable = require('./collidable.js'),
    Circle = require('./circle.js'),
    Point = require('./point.js'),
    Mouse = require('./mouse.js'),
    dragonCollisions = require('./dragon-collisions.js'),
    tapping = false;

Mouse.on.down(function () {
    tapping = true;
});

module.exports = Collidable({
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
