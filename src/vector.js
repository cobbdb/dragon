var Point = require('./point.js');

/**
 * @param {Point} [opts.start] Defaults to (0,0).
 * @param {Dimension|Point} [opts.size|opts.end] Defaults
 * to (0,0). Either size of vector or the ending point.
 */
module.exports = function (opts) {
    var start, end;

    opts = opts || {};
    start = opts.start || Point();
    end = opts.end || Point();

    if (opts.size) {
        end.x = start.x + opts.size.width;
        end.y = start.y + opts.size.height;
    }

    return {
        start: start,
        end: end,
        get size () {
            var rise = this.end.x - this.start.x,
                run = this.end.y - this.start.y;
            return Math.sqrt((rise * rise) + (run * run));
        }
    };
};
