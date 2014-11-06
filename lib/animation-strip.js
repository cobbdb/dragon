/**
 * @param opts.sheet
 * @param opts.start.x
 * @param opts.start.y
 * @param opts.size.width
 * @param opts.size.height
 * @param opts.frames
 * @param opts.speed (frames / second) 0 to
 */
module.exports = function (opts) {
    var timeBetweenFrames,
        timeLastFrame,
        timeSinceLastFrame = 0,
        state = 'LOCKED';

    if (opts.speed) {
        // Convert to milliseconds / frame
        timeBetweenFrames = (1 / opts.speed) * 1000;
    } else {
        timeBetweenFrames = 0;
    }

    return {
        frame: 0,
        start: function () {
            timeLastFrame = new Date().getTime();
            state = 'UNLOCKED';
        },
        pause: function () {
            state = 'LOCKED';
        },
        stop: function () {
            state = 'LOCKED';
            timeSinceLastFrame = 0;
            this.frame = 0;
        },
        update: function () {
            var now, elapsed;
            if (state === 'UNLOCKED') {
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
