var BaseClass = require('baseclassjs'),
    Eventable = require('./eventable.js');

/**
 * @class Item
 * @extends Eventable
 * Item is the most basic contract in the Dragon game engine. Almost
 * everything in the engine is derived from Item - including Sprites
 * and Screens.
 * @param {String} [opts.name]
 * @param {String} [opts.kind]
 * @param {Boolean} [opts.updating] Defaults to true.
 * @param {Boolean} [opts.drawing] Defaults to true.
 * @param {Number} [opts.depth] Defaults to 0.
 */
module.exports = function (opts) {
    opts = opts || {};

    return Eventable(opts).extend({
        name: opts.name || '$:item',
        kind: opts.kind || '$:item',
        depth: opts.depth || 0,
        removed: false,
        updating: ('updating' in opts) ? opts.updating : true,
        drawing: ('drawing' in opts) ? opts.drawing : true,
        update: BaseClass.Stub,
        draw: BaseClass.Stub,
        teardown: BaseClass.Stub,
        start: function () {
            this.updating = true;
            this.drawing = true;
            this.trigger('$start');
        },
        pause: function () {
            this.updating = false;
            this.drawing = true;
            this.trigger('$pause');
        },
        stop: function () {
            this.updating = false;
            this.drawing = false;
            this.trigger('$stop');
        }
    });
};
