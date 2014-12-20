var cache = {};

/**
 * Duplicate calls to constructor will only
 * load a single time - returning cached
 * data on subsequent calls.
 * @param {String} opts.src
 * @param {Function} [opts.onload]
 */
module.exports = function (opts) {
    var img, onload;

    // Check if already loaded and cached.
    if (opts.src in cache) {
        img = cache[opts.src];
        if (img.ready) {
            onload(img);
        }
        return img;
    }

    // Create and cache the new image.
    img = new Image();
    img.ready = false;
    cache[opts.src] = img;

    img.load = function (cb) {
        onload = cb || function () {};
        img.onload = function () {
            img.ready = true;
            onload(img);
        };
        img.src = 'assets/img/' + opts.src;
    };

    return img;
};
