var BaseClass = require('baseclassjs'),
    Sprite = require('./sprite.js'),
    Item = require('./item.js');

/**
 * # Clear Sprite
 * An invisible sprite with collision logic.
 */
module.exports = function (opts) {
    opts = opts || {};
    return Sprite(opts).extend({
        strip: Item(),
        load: function (cb) {
            cb();
        },
        useStrip: BaseClass.Stub,
        getStrip: BaseClass.Stub,
        draw: BaseClass.Stub
    });
};
