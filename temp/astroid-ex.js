module.exports = function () {
    var self = Sprite().extend({
        name: 'astroid'
    });
    self.on('collide/astroid', function (other) {
        // bounce away
    });
    self.on('collide/bullet', function (other) {
        // explode
    });
    self.on('collide/ship', function (other) {
        // explode
    });
    self.on('separate/astroid', function (other) {
        // create sparks
    });
    return self;
};
