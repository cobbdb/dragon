var Sprite = require('../sprite.js'),
    Rectangle = require('../geom/rectangle.js'),
    Point = require('../geom/point.js'),
    AnimationStrip = require('../animation-strip.js'),
    collisions = require('../dragon-collisions.js'),
    Util = require('../util/object.js');

/**
 * @class Button
 * @extends Sprite
 * @param {Image} opts.up.image
 * @param {Image} [opts.down.image]
 * @param {Function} [opts.onpress]
 */
module.exports = function (opts) {
    Util.mergeDefaults(opts, {
        down: opts.up,
        name: 'dragon-ui-button',
        kind: 'dragon-ui-button',
        on: {},
        strips: {},
        mask: Rectangle(),
        collisions: collisions,
        startingStrip: 'up',
        onpress: function () {}
    });
    opts.on['colliding#screentap'] = function () {
        opts.onpress.call(this);
    };
    opts.on['colliding#screenhold'] = function () {
        this.useStrip('down');
    };
    opts.on['separate#screenhold'] = function () {
        this.useStrip('up');
    };
    opts.strips.up = AnimationStrip({
        sheet: $.image(opts.up)
    });
    opts.strips.down = AnimationStrip({
        sheet: $.image(opts.down)
    });

    return Sprite(opts);
};
