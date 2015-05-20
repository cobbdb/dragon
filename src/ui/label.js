var ClearSprite = require('../clear-sprite.js');

/**
 * # Label (Sprite)
 * ### **$.ui.Label()**
 * Labels do not have collision logic nor are they displayed
 * from image assets. Labels instead contain only text.
 * @param {String} opts.text
 * @param {Function} [opts.style]
 * @param {Point} opts.pos
 * @param {String} [opts.name] Defaults to `dragon-ui-label`.
 */
module.exports = function (opts) {
    opts.style = opts.style || function () {};

    return ClearSprite({
        name: opts.name || 'dragon-ui-label',
        pos: opts.pos
    }).extend({
        text: opts.text,
        draw: function (ctx) {
            opts.style(ctx);
            ctx.fillText(
                this.text,
                this.pos.x,
                this.pos.y
            );
        }
    });
};
