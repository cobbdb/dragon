var Sprite = require('../sprite.js'),
    AnimationStrip = require('../animation-strip.js'),
    Util = require('../util/object.js');

/**
 * @class Decal
 * @extends Sprite
 * A decal is a sprite that has no collision logic and
 * displays as an image only.
 * @param {Image} opts.sheet
 */
module.exports = function (opts) {
    Util.mergeDefaults(opts, {
        name: 'dragon-ui-decal',
        kind: 'dragon-ui-decal',
        strips: {},
        startingStrip: 'decal'
    });
    opts.strips.decal = AnimationStrip({
        sheet: $.image(opts.src)
    });
    return Sprite(opts);
};
