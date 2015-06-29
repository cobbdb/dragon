var ClearSprite = require('../clear-sprite.js'),
    Util = require('../util/object.js');

/**
 * @class Label
 * @extends ClearSprite
 * Labels do not have collision logic nor are they displayed
 * from image assets. Labels instead contain only text.
 * @param {String} opts.text
 * @param {Function} [opts.style]
 */
module.exports = function (opts) {
    Util.mergeDefaults(opts, {
        name: 'dragon-ui-label',
        kind: 'dragon-ui-label',
        text: '',
        style: function () {}
    });

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
