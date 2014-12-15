var BaseClass = require('baseclassjs');

module.exports = function (x, y) {
    return BaseClass({
        x: x || 0,
        y: y || 0,
        move: function (x, y) {
            // --> This is an issue with baseclass
            this.leaf.x = x;
            this.leaf.y = y;
        },
        intersects: BaseClass.Stub,
        draw: BaseClass.Stub
    });
};
