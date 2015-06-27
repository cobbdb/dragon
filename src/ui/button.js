var Sprite = require('../sprite.js'),
    Rectangle = require('../geom/rectangle.js'),
    Point = require('../geom/point.js'),
    AnimationStrip = require('../animation-strip.js'),
    SpriteSheet = require('../spritesheet.js'),
    collisions = require('../dragon-collisions.js');

/**
 * @class Button
 * @extends Sprite
 * @param {Function} opts.onpress
 * @param {String} opts.up.src
 * @param {Dimension} opts.up.size
 * @param {String} [opts.down.src]
 * @param {Dimension} [opts.down.size]
 * @param {Point} opts.pos
 * @param {Dimension} opts.size
 * @param {String} [opts.name] Defaults to `dragon-ui-button`.
 */
module.exports = function (opts) {
    opts.down = opts.down || {};

    return Sprite({
        name: opts.name || 'dragon-ui-button',
        collisionSets: [
            collisions
        ],
        mask: Rectangle(
            Point(),
            opts.size
        ),
        strips: {
            up: AnimationStrip({
                src: opts.up.src,
                size: opts.up.size
            }),
            down: AnimationStrip({
                src: opts.down.src || opts.up.src,
                size: opts.down.size || opts.up.size
            })
        },
        startingStrip: 'up',
        pos: opts.pos,
        size: opts.size,
        on: {
            'colliding#screentap': function () {
                opts.onpress.call(this);
            },
            'colliding#screenhold': function () {
                this.useStrip('down');
            }
        }
    }).extend({
        update: function () {
            this.useStrip('up');
            this.base.update();
        }
    });
};
