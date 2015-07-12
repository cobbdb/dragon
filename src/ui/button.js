var Sprite = require('../sprite.js'),
    Rectangle = require('../geom/rectangle.js'),
    Point = require('../geom/point.js'),
    Util = require('../util/object.js');

/**
 * @class Button
 * @extends Sprite
 * Uses strips named `up` and `down` for when the button
 * is being pressed vs. normal.
 * @param {Function} [opts.onpress]
 * @param {Boolean} [opts.auto] Defaults to true. False
 * to disable auto up/down strip transition.
 */
module.exports = function (opts) {
    opts = Util.mergeDefaults(opts, {
        down: opts.up,
        name: '$:ui-button',
        kind: '$:ui-button',
        on: {},
        strips: {},
        mask: Rectangle(),
        collisions: [],
        startingStrip: 'up',
        onpress: function () {},
        auto: true
    });
    opts.collisions = [].concat(
        opts.collisions,
        require('../dragon-collisions.js')
    );
    opts.on['$collide#screentap'] = function () {
        if (this.auto) {
            this.useStrip('down');
        }
        opts.onpress.call(this);
    };
    opts.on['$miss#screenhold'] = function () {
        if (this.auto) {
            this.useStrip('up');
        }
    };

    return Sprite(opts).extend({
        auto: opts.auto
    });
};
