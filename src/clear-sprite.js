var BaseClass = require('baseclassjs'),
    Sprite = require('./sprite.js');

/**
 * # Clear Sprite
 * An invisible sprite without any collision or
 * update logic. This is a blank canvas used for
 * edge cases such as ui's Label and Decal classes.
 */
module.exports = function (opts) {
    opts = opts || {};
    return Sprite(opts).extend({
        load: function (cb) {
            cb();
        },
        drawing: opts.drawing === false ? false : true,
        updating: opts.updating === false ? false : true,
        start: function () {
            this.drawing = true;
            this.updating = true;
        },
        pause: function () {
            this.drawing = true;
            this.updating = false;
        },
        stop: function () {
            this.drawing = false;
            this.updating = false;
        },
        update: BaseClass.Stub,
        draw: BaseClass.Stub
    });
};
