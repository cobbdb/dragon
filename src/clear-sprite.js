var BaseClass = require('baseclassjs'),
    Sprite = require('./sprite.js');

module.exports = function (opts) {
    return Sprite(opts).extend({
        load: function (cb) {
            cb();
        },
        start: BaseClass.Stub,
        pause: BaseClass.Stub,
        stop: BaseClass.Stub,
        update: BaseClass.Stub,
        draw: BaseClass.Stub
    });
};
