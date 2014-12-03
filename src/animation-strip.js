/**
 * @param opts.sheet
 * @param opts.start.x
 * @param opts.start.y
 * @param opts.size.width
 * @param opts.size.height
 * @param opts.frames
 * @param opts.speed (frames / second)
 */
module.exports = function (opts) {
    var timeBetweenFrames,
        timeLastFrame,
        timeSinceLastFrame = 0,
        updating = false;

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
            this.frame %= opts.frames;
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
                opts.start.x + offset, opts.start.y, opts.size.width, opts.size.height,
                pos.x, pos.y, opts.size.width, opts.size.height
            );
            ctx.restore();
        }
    };
};
