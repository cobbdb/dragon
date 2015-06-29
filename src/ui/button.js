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
 * @param {Dimension} [opts.up.size]
 * @param {Image} [opts.down.image]
 * @param {Dimension} [opts.down.size]
 * @param {Function} [opts.onpress]
 */
module.exports = function (opts) {
    Util.mergeDefaults(opts, {
        down: {
            image: opts.up.image,
            size: opts.up.size
        },
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
    opts.strips.up = AnimationStrip(opts.up.image, {
        size: opts.up.size
    });
    opts.strips.down = AnimationStrip(opts.down.src, {
        size: opts.down.size
    });

    return Sprite(opts);
};
