/**
 * Slider is now deprecated.. probably forever.
 * @deprecated
 */

var Sprite = require('../sprite.js'),
    Dimension = require('../geom/dimension.js'),
    Rectangle = require('../geom/rectangle.js'),
    Point = require('../geom/point.js'),
    AnimationStrip = require('../animation-strip.js'),
    SpriteSheet = require('../spritesheet.js'),
    ClearSprite = require('../clear-sprite.js'),
    collisions = require('../dragon-collisions.js');

/**
 * @class Slider
 * @extends ClearSprite
 * @param {Function} [opts.onslide] Called on slide event. Accepts
 * current percentage as a number between 0 and 100.
 * @param {Point} opts.pos
 * @param {Dimension} opts.size
 * @param {String} src.lane
 * @param {String} src.knob
 */
module.exports = function (opts) {
    var pos = opts.pos,
        size = opts.size,
        buffer = 5,
        knobSize = Dimension(16, 32),
        lane = Sprite({
            name: '$:slider-lane',
            collisionSets: [
                collisions
            ],
            mask: Rectangle(
                Point(),
                Dimension(
                    size.width,
                    size.height - buffer * 2
                )
            ),
            strips: {
                'slider': AnimationStrip({
                    src: opts.src.lane,
                    size: Dimension(32, 8)
                })
            },
            startingStrip: 'slider',
            pos: Point(
                pos.x - size.width / 2,
                pos.y - size.height / 2 + buffer
            ),
            size: Dimension(
                size.width,
                size.height - buffer * 2
            ),
            on: {
                '$colliding#screentap': function (mouse) {
                    var x, value;
                    x = Math.max(mouse.mask.x, this.mask.left);
                    x = Math.min(x, this.mask.right);
                    knob.pos.x = x - knobSize.width / 2;

                    value = x - this.mask.left;
                    value = (value / this.mask.width).toFixed(3);
                    opts.onslide(value);
                }
            }
        }),
        knob = Sprite({
            name: '$:slider-knob',
            collisionSets: [
                collisions
            ],
            mask: Rectangle(
                Point(),
                knobSize
            ),
            strips: {
                'slider': AnimationStrip({
                    src: opts.src.knob,
                    size: Dimension(8, 16)
                })
            },
            startingStrip: 'slider',
            pos: Point(
                pos.x - knobSize.width / 2,
                pos.y - knobSize.height / 2
            ),
            size: knobSize,
            on: {
                '$colliding#screendrag': function (mouse) {
                    var x, value;
                    x = Math.max(mouse.mask.x, lane.mask.left);
                    x = Math.min(x, lane.mask.right);
                    this.pos.x = x - knobSize.width / 2;

                    value = x - lane.mask.left;
                    value = (value / lane.mask.width).toFixed(3);
                    opts.onslide(value);
                }
            }
        });

    opts.onslide = opts.onslide || function () {};

    return ClearSprite().extend({
        load: function (cb) {
            var queue = 2,
                done = function () {
                    queue -= 1;
                    if (!queue) {
                        cb();
                    }
                };
            lane.load(done);
            knob.load(done);
        },
        start: function () {
            lane.start();
            knob.start();
        },
        pause: function () {
            lane.pause();
            knob.start();
        },
        stop: function () {
            lane.stop();
            knob.stop();
        },
        update: function () {
            lane.update();
            knob.update();
        },
        draw: function (ctx) {
            lane.draw(ctx);
            knob.draw(ctx);
        },
        teardown: function () {
            lane.teardown();
            knob.teardown();
        }
    });
};
