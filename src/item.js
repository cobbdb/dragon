var BaseClass = require('baseclassjs'),
    Eventable = require('./interface/eventable.js');

/**
 * @class Item
 * @extends BaseClass
 * @implements Eventable
 * Item is the most basic contract in the Dragon game engine. Almost
 * everything in the engine is derived from Item - including Sprites
 * and Screens.
 * @param {String} [opts.name]
 * @param {String} [opts.kind]
 * @param {Boolean} [opts.updating] Defaults to true.
 * @param {Boolean} [opts.drawing] Defaults to true.
 * @param {Map Of Functions} [opts.on] Dictionary of events.
 * @param {Map of Functions} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    opts = opts || {};

    return BaseClass({
        name: opts.name || 'dragon-item',
        kind: opts.kind || 'dragon-item',
        depth: 0,
        updating: (typeof opts.updating === 'boolean') ? opts.updating : true,
        drawing: (typeof opts.drawing === 'boolean') ? opts.drawing : true,
        update: BaseClass.Stub,
        draw: BaseClass.Stub,
        teardown: BaseClass.Stub,
        start: function () {
            this.updating = true;
            this.drawing = true;
            this.trigger('start');
        },
        pause: function () {
            this.updating = false;
            this.drawing = true;
            this.trigger('pause');
        },
        stop: function () {
            this.updating = false;
            this.drawing = false;
            this.trigger('stop');
        }
    }).implement(
        Eventable({
            events: opts.on,
            singles: opts.one
        })
    );
};
