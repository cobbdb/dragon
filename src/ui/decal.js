var Sprite = require('../sprite.js'),
    AnimationStrip = require('../animation-strip.js'),
    Util = require('../util/object.js');

/**
 * @class Decal
 * @extends Sprite
 * A decal is a sprite that has no collision logic and
 * displays as an image only.
 * @param {String} src Image path.
 * @param {Object} [opts] Additional Sprite options.
 */
module.exports = function (src, opts) {
    Util.mergeDefaults(opts, {
        name: 'dragon-ui-decal',
        kind: 'dragon-ui-decal',
        strips: {},
        startingStrip: 'decal'
    });
    opts.strips.decal = AnimationStrip(src);
    return Sprite(opts);
};
