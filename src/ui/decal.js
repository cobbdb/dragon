var Sprite = require('../sprite.js'),
    AnimationStrip = require('../animation-strip.js'),
    SpriteSheet = require('../spritesheet.js');

/**
 * @class Decal
 * A decal is a sprite that has no collision logic and
 * displays as an image only.
 * @extends Sprite
 * @param {String} opts.strip.src
 * @param {Dimension} opts.strip.size
 * @param {Point} opts.pos
 * @param {Dimension} [opts.size]
 * @param {Number} [opts.scale]
 * @param {String} [opts.name] Defaults to `dragon-ui-decal`.
 */
module.exports = function (opts) {
    opts.name = opts.name || 'dragon-ui-decal';
    opts.strips = {
        decal: AnimationStrip({
            sheet: SpriteSheet({
                src: opts.strip.src
            }),
            size: opts.strip.size
        })
    };
    return Sprite(opts);
};
