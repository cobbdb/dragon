var BaseClass = require('baseclassjs'),
    ClearSprite = require('../clear-sprite.js');

/**
 * @class Label
 * @extends ClearSprite
 * Labels do not have collision logic nor are they displayed
 * from image assets. Labels instead contain only text.
 * @param {String} [opts.text]
 * @param {Function} [opts.style]
 */
module.exports = function (opts) {
    opts = opts || {};
    opts.name = opts.name || '$:ui-label';
    opts.kind = opts.kind || '$:ui-label';
    opts.text = opts.text || '';
    opts.style = opts.style || BaseClass.Stub;

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
