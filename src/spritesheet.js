var cache = {};

/**
 * Duplicate calls to constructor will only
 * load a single time - returning cached
 * data on subsequent calls.
 * @param {String} opts.src
 * @param {Function} [opts.onload]
 */
module.exports = function (opts) {
    var img,
        onload = opts.onload || function () {};

    // Check if already loaded and cached.
    if (opts.src in cache) {
        img = cache[opts.src];
        onload(img);
        return img;
    }

    // Create and cache the new image.
    img = new Image();
    img.ready = false;
    cache[opts.src] = img;

    img.onload = function () {
        img.ready = true;
        onload(img);
    };

    img.src = 'assets/img/' + opts.src;
    return img;
};
