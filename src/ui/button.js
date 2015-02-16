var Sprite = require('../sprite.js'),
    Dimension = require('../dimension.js'),
    Rectangle = require('../rectangle.js'),
    Point = require('../point.js'),
    AnimationStrip = require('../animation-strip.js'),
    SpriteSheet = require('../spritesheet.js'),
    collisions = require('../dragon-collisions.js');

/**
 * @param {Function} opts.onpress
 * @param {String} opts.up.src
 * @param {Dimension} opts.up.size
 * @param {String} [opts.down.src]
 * @param {Dimension} [opts.down.size]
 * @param {Point} opts.pos
 * @param {Dimension} opts.size
 */
module.exports = function (opts) {
    opts.down = opts.down || {};

    return Sprite({
        name: 'dragon-ui-button',
        collisionSets: [
            collisions
        ],
        mask: Rectangle(
            Point(),
            opts.size
        ),
        strips: {
            up: AnimationStrip({
                sheet: SpriteSheet({
                    src: opts.up.src
                }),
                size: opts.up.size
            }),
            down: AnimationStrip({
                sheet: SpriteSheet({
                    src: opts.down.src || opts.up.src
                }),
                size: opts.down.size || opts.up.size
            })
        },
        startingStrip: 'up',
        pos: opts.pos,
        size: opts.size,
        on: {
            'colliding/screentap': function () {
                this.useStrip('down');
                opts.onpress();
            },
            'colliding/screenhold': function () {
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
