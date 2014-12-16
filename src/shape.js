var BaseClass = require('baseclassjs'),
    Point = require('./point.js');

/**
 * @param {Point} [opts.pos] Defaults to (0,0).
 */
module.exports = function (opts) {
    var pos;

    opts = opts || {};
    pos = opts.pos || Point();

    return BaseClass({
        x: pos.x,
        y: pos.y,
        name: opts.name,
        move: function (x, y) {
            this.x = x;
            this.y = y;
        },
        intersects: function (other) {
            return this.intersectMap[other.name].call(this, other);
        },
        intersectMap: {},
        draw: BaseClass.Stub
    });
};
