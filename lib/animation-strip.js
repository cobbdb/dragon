/**
 * @param opts.sheet
 * @param opts.start.x
 * @param opts.start.y
 * @param opts.size.width
 * @param opts.size.height
 * @param opts.frames
 */
module.exports = function (opts) {
    return {
        frame: 0,
        nextFrame: function () {
            this.frame += 1;
            this.frame %= opts.frames;
            return this.frame;
        },
        draw: function (ctx, dx, dy, immutable) {
            var offset = this.frame * opts.width;
            ctx.drawImage(opts.sheet,
                opts.start.x + offset, opts.start.y, opts.size.width, opts.size.height,
                dx, dy, opts.size.width, opts.size.height
            );
            if (!immutable) {
                this.nextFrame();
            }
        }
    };
};
