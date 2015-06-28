/**
 * Duplicate calls to constructor will only
 * load a single time - returning cached
 * data on subsequent calls.
 * @param {String} src
 * @param {Function} [onload]
 * @return {Image} HTML5 Image instance.
 */
module.exports = function (src, onload) {
    var img = new Image();
    img.onload = onload;
    img.src = src;
    return img;
};
