var BaseClass = require('baseclassjs');

module.exports = function (x, y) {
    return {
        extend: BaseClass,
        x: x || 0,
        y: y || 0,
        move: function (x, y) {
            this.x = x;
            this.y = y;
        },
        collidesWith: BaseClass.Stub
    };
};
