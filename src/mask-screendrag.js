var Collidable = require('./collidable.js'),
    Circle = require('./circle.js'),
    Point = require('./point.js'),
    Mouse = require('./mouse.js');

module.exports = Collidable({
    name: 'screendrag',
    mask: Circle(Point(), 8)
}).extend({
    update: function () {
        if (Mouse.is.dragging) {
            this.move(Mouse.offset);
        } else {
            this.move(
                Point(-999, -999)
            );
        }
    }
});
