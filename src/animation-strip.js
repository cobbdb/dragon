var Dimension = require('./dimension.js'),
    Point = require('./point.js');

/**
 * @param {SpriteSheet} opts.sheet
 * @param {Point} [opts.start] Point in the sprite sheet
 * of the first frame.
 * @param {Dimension} [opts.size] Size of each frame in
 * the sprite sheet.
 * @param {Number} [opts.frames] Defaults to 1. Number
 * of frames in this strip.
 * @param {Number} [opts.speed] Number of frames per second.
 */
module.exports = function (opts) {
    var timeBetweenFrames,
        timeLastFrame,
        timeSinceLastFrame = 0,
        updating = false,
        frames = opts.frames || 1,
        size = opts.size || Dimension(),
        start = opts.start || Point();

    if (opts.speed > 0) {
        // Convert to milliseconds / frame
        timeBetweenFrames = (1 / opts.speed) * 1000;
    } else {
        timeBetweenFrames = 0;
    }

    return {
        get ready () {
            return opts.sheet.ready;
        },
        frame: 0,
        start: function () {
            timeLastFrame = new Date().getTime();
            updating = true;
        },
        /**
         * Pausing halts the update loop but
         * retains animation position.
         */
        pause: function () {
            updating = false;
        },
        /**
         * Stopping halts update loop and
         * resets the animation.
         */
        stop: function () {
            updating = false;
            timeSinceLastFrame = 0;
            this.frame = 0;
        },
        update: function () {
            var now, elapsed;
            if (updating) {
                now = new Date().getTime();
                elapsed = now - timeLastFrame;
                timeLastFrame = now;
                timeSinceLastFrame += elapsed;
                if (timeSinceLastFrame >= timeBetweenFrames) {
                    timeSinceLastFrame -= timeBetweenFrames;
                    this.nextFrame();
                }
            }
        },
        nextFrame: function () {
            this.frame += 1;
            this.frame %= frames;
            return this.frame;
        },
        draw: function (ctx, pos, scale, rot) {
            var offset = this.frame * opts.width;
            scale = scale || 1;
            rot = rot || 0;

            // Apply the canvas transforms.
            ctx.save();
            ctx.translate(pos.x, pos.y);
            ctx.rotate(rot);
            ctx.scale(scale, scale);

            // Draw the frame and restore the canvas.
            ctx.drawImage(opts.sheet,
                start.x + offset, start.y, size.width, size.height,
                pos.x, pos.y, size.width, size.height
            );
            ctx.restore();
        }
    };
};
