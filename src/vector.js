var Point = require('./point.js'),
    Dimension = require('./dimension.js');

/**
 * @param {Dimension|Point} opts.size|opts.end Either size
 * of vector or the ending point.
 * @param {Point} [opts.start] Defaults to (0,0).
 */
module.exports = function (opts) {
    var start = opts.start || Point(),
        end = opts.end || Point(
            start.x + opts.size.width,
            start.y + opts.size.height
        );

    return {
        start: start,
        end: end,
        get size () {
            var rise = end.x - start.x,
                run = end.y - start.y;
            return Math.sqrt((rise * rise) + (run * run));
        }
    };
};
