/**
 * @param opts.onload
 * @param opts.src
 */
module.exports = function (opts) {
    var img = new Image();
    img.onload = opts.onload;
    img.src = opts.src;
    return img;
};
