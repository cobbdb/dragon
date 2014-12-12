var cache = {};

/**
 * Duplicate calls to constructor will only
 * load a single time - returning cached
 * data on subsequent calls.
 * @param {String} opts.src
 */
module.exports = function (opts) {
    var img;

    // Check if already loaded and cached.
    if (opts.src in cache) {
        return cache[opts.src];
    }

    // Create and cache the new image.
    img = new Image();
    img.ready = false;
    cache[opts.src] = img;

    img.onload = function () {
        img.ready = true;
    };

    img.src = 'assets/img/' + opts.src;
    return img;
};
