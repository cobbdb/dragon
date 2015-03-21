var Sprite = require('../sprite.js'),
    AnimationStrip = require('../animation-strip.js'),
    SpriteSheet = require('../spritesheet.js');

/**
 * @param {String} opts.strip.src
 * @param {Dimension} opts.strip.size
 * @param {Point} opts.pos
 * @param {Dimension} opts.size
 * @param {String} [opts.name] Defaults to `dragon-ui-decal`.
 */
module.exports = function (opts) {
    return Sprite({
        name: opts.name || 'dragon-ui-decal',
        strips: {
            decal: AnimationStrip({
                sheet: SpriteSheet({
                    src: opts.strip.src
                }),
                size: opts.strip.size
            })
        },
        startingStrip: 'decal',
        pos: opts.pos,
        size: opts.size
    });
};
