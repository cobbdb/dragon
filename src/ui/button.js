var BaseClass = require('baseclassjs'),
    Sprite = require('../sprite.js'),
    Rectangle = require('../geom/rectangle.js'),
    Point = require('../geom/point.js'),
    Set = require('../util/set.js'),
    dragonCollisions = require('../dragonCollisions.js');

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
    opts = opts || {};
    opts.down = opts.down || opts.up;
    opts.name = opts.name || '$:ui-button';
    opts.kind = opts.kind || '$:ui-button';
    opts.startingStrip = opts.startingStrip || 'up';
    opts.onpress = opts.onpress || BaseClass.Stub;

    opts.collisions = Set.concat(
        opts.collisions,
        dragonCollisions
    );

    opts.on = opts.on || {};
    opts.on['$collide#screentap'] = Set.concat(
        opts.on['$collide#screentap'],
        function () {
            if (this.auto) {
                this.useStrip('down');
            }
            opts.onpress.call(this);
        }
    };
    opts.on['$miss#screenhold'] = Set.concat(
        opts.on['$miss#screenhold'],
        function () {
            if (this.auto) {
                this.useStrip('up');
            }
        }
    };

    return Sprite(opts).extend({
        auto: opts.auto || true
    });
};
