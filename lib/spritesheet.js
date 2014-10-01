/**
 * @param opts.onload
 * @param opts.src
 */
function _SpriteSheet(opts) {
    var img = new Image();
    img.onload = opts.onload;
    img.src = opts.src;
    return img;
}
