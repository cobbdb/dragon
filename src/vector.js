var Point = require('./point.js');

/**
 * Can be created with either:
 * Vector(10, 20);
 * or
 * Vector(5, 2, 15, 22);
 * Both of these vectors are === to each other.
 */
function Vector(run, rise, x2, y2) {
    if (y2 !== undefined) {
        run = run - x2;
        rise = rise - y2;
    }
    return {
        extend: require('baseclassjs'),
        x: run,
        y: rise,
        length: function () {
            return Math.sqrt((rise * rise) + (run * run));
        }
    };
}
Vector.length = function (run, rise, x2, y2) {
    if (y2 !== undefined) {
        run = run - x2;
        rise = rise - y2;
    }
    return Math.sqrt((rise * rise) + (run * run));
};

module.exports = Vector;
