module.exports = function () {
    var self = Sprite({
        name: 'asteroid'
    }).extend();
    self.on('collide/asteroid', function (other) {
        // bounce away
    });
    self.on('collide/bullet', function (other) {
        // explode
    });
    self.on('collide/ship', function (other) {
        // explode
    });
    self.on('separate/asteroid', function (other) {
        // create sparks
    });
    return self;
};
