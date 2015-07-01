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
 */
module.exports = function (opts) {
    opts = Util.mergeDefaults(opts, {
        down: opts.up,
        name: 'dragon-ui-button',
        kind: 'dragon-ui-button',
        on: {},
        strips: {},
        mask: Rectangle(),
        collisions: [],
        startingStrip: 'up',
        onpress: function () {}
    });
    opts.collisions = [].concat(
        opts.collisions,
        require('../dragon-collisions.js')
    );
    opts.on['collide#screentap'] = function () {
        this.useStrip('down');
        opts.onpress.call(this);
    };
    opts.on['miss#screenhold'] = function () {
        this.useStrip('up');
    };

    return Sprite(opts);
};
