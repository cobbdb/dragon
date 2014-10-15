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
    // Convert to milliseconds / frame
    var timeBetweenFrames = (1 / opts.speed) * 1000,
        timeLastFrame,
        timeSinceLastFrame = 0,
        States = {
            LOCKED: 0,
            UNLOCKED: 1
        },
        state = States.LOCKED;

    return {
        frame: 0,
        start: function () {
            timeLastFrame = new Date().getTime();
            state = States.UNLOCKED;
        },
        pause: function () {
            state = States.LOCKED;
        },
        stop: function () {
            state = States.LOCKED;
            timeSinceLastFrame = 0;
            this.frame = 0;
        },
        update: function () {
            var now, elapsed;
            if (state === States.UNLOCKED) {
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
