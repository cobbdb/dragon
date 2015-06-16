var BaseClass = require('baseclassjs'),
    Eventable = require('./interfaces/eventable.js');

/**
 * # Collection Item
 * Item is the most basic contract in the Dragon game engine. Almost
 * everything in the engine is derived from Item - including Sprites
 * and Screens.
 * @param {Map Of Functions} [opts.on] Dictionary of events.
 * @param {Map of Functions} [opts.one] Dictionary of one-time events.
 * @return {Item}
 */
module.exports = function (opts) {
    opts = opts || {};

    return BaseClass({
        name: 'dragon-item',
        depth: 0,
        updating: true,
        drawing: true,
        update: BaseClass.Stub,
        draw: BaseClass.Stub,
        teardown: BaseClass.Stub
    }).implement(
        Eventable({
            events: opts.on,
            singles: opts.one
        })
    );
};
