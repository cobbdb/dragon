var BaseClass = require('baseclassjs');

module.exports = function (x, y) {
    return BaseClass({
        x: x || 0,
        y: y || 0,
        move: function (x, y) {
            this.x = x;
            this.y = y;
        },
        intersects: BaseClass.Stub
    });
};
