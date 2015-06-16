var ClearSprite = require('../clear-sprite.js');

/**
 * @class Label
 * @extends ClearSprite
 * Labels do not have collision logic nor are they displayed
 * from image assets. Labels instead contain only text.
 * @param {String} opts.text
 * @param {Number} [opts.depth]
 * @param {Function} [opts.style]
 * @param {Point} opts.pos
 * @param {String} [opts.name] Defaults to `dragon-ui-label`.
 */
module.exports = function (opts) {
    opts.style = opts.style || function () {};
    opts.name = opts.name || 'dragon-ui-label';

    return ClearSprite(opts).extend({
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
