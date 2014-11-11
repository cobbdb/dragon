/**
 * @param opts.onload
 * @param opts.src
 */
module.exports = function (opts) {
    /**
     * SpriteSheet needs to look inside
     * of assets/img directory.. both
     * for convenience but also to enforce
     * some kind of paradigm.
     */
    /**
     * There should be be evening around the
     * onload event of img.
     */
    var img = new Image();
    img.onload = opts.onload;
    img.src = opts.src;
    return img;
};
