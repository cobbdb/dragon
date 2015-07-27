var Item = require('./item.js'),
    Dimension = require('./geom/dimension.js'),
    Point = require('./geom/point.js'),
    pipeline = require('./assets/pipeline.js');

/**
 * @param {String} src Image filename.
 * @param {Point} [opts.start] Defaults to (0,0). Index in the
 * sprite sheet of the first frame.
 * @param {Dimension} [opts.size] Defaults to (0,0). Size of
 * each frame in the sprite sheet.
 * @param {Number} [opts.frames] Defaults to 1. Number of
 * frames in this strip.
 * @param {Number} [opts.speed] Defaults to 0. Number of frames per second.
 * @param {Boolean} [opts.sinusoid] Defaults to false. True
 * to cycle the frames forward and backward per cycle.
 */
module.exports = function (src, opts) {
    var img = pipeline.get.image(src),
        timeLastFrame,
        timeSinceLastFrame = 0,
        updating = false,
        firstFrame,
        direction = 1;

    opts.kind = opts.kind || '$:animation-strip';
    opts.sinusoid = opts.sinusoid || false;
    opts.start = opts.start || Point();
    opts.frames = opts.frames || 1;
    opts.size = opts.size || Dimension(
        img.width / opts.frames,
        img.height
    );
    firstFrame = Point(
        opts.size.width * opts.start.x,
        opts.size.height * opts.start.y
    );

    return Item(opts).extend({
        /**
         * Size of each frame in the image - not
         * draw size.
         * @type {Dimension}
         */
        size: opts.size,
        frame: 0,
        speed: opts.speed || 0,
        /**
         * Begin the animation. Will not truly start
         * unless `speed` is greater than zero.
         */
        start: function () {
            timeLastFrame = global.Date.now();
            // `updating` should never be true when
            // speed is zero.
            updating = this.speed > 0;
        },
        /**
         * Stop the animation, but retain position.
         */
        pause: function () {
            updating = false;
        },
        /**
         * Stop the animation and reset position.
         */
        stop: function () {
            timeSinceLastFrame = 0;
            this.frame = 0;
            direction = 1;
            updating = false;
        },
        /**
         * Advance the animation.
         * Should not be called when `updating` is false.
         */
        update: function () {
            var timeBetweenFrames = (1 / this.speed) * 1000,
                now = global.Date.now(),
                elapsed = now - timeLastFrame;
            timeSinceLastFrame += elapsed;
            if (timeSinceLastFrame >= timeBetweenFrames) {
                timeSinceLastFrame = 0;
                this.nextFrame();
            }
            timeLastFrame = now;
        },
        /**
         * Calculate the next animation frame index.
         * @return {Number} Frame index.
         */
        nextFrame: function () {
            this.frame += direction;
            if (opts.sinusoid) {
                if (this.frame % (opts.frames - 1) === 0) {
                    direction *= -1;
                }
            } else {
                this.frame %= opts.frames;
            }
            return this.frame;
        },
        /**
         * @param {Context2D} ctx Canvas 2D context.
         * @param {Dimension} [size] Defaults to full
         * image Dimension. Draw size of Image.
         */
        draw: function (ctx, size) {
            var offset = this.frame * this.size.width;
            ctx.drawImage(img,
                firstFrame.x + offset,
                firstFrame.y,
                this.size.width,
                this.size.height,
                0, 0,
                size.width || this.size.width,
                size.height || this.size.height
            );
        }
    });
};
