var createImage = require('./image.js'),
    cache = {};

/**
 * Duplicate calls to constructor will only
 * load a single time - returning cached
 * data on subsequent calls.
 * @param {String} opts.src
 */
module.exports = function (opts) {
    var img,
        src = opts.src;

    if (src in cache) {
        img = cache[src];
    } else {
        img = createImage(src);
        cache[src] = img;
    }

    return img;
};
