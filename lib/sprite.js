/**
 * @param sheet
 * @param opts.pos.x, opts.pos.y
 * @param opts.src.x, opts.src.y
 * @param opts.size.width, opts.size.height
 * @param opts.mask
 */
function _Sprite(sheet, opts) {
    return {
        extend: BaseClass,
        pos: opts.pos || _Point(),
        speed: opts.speed || _Point(),
        update: function () {
            this.shift();
        },
        draw: function (ctx, dx, dy) {
            ctx.drawImage(sheet,
                opts.src.x, opts.src.y, opts.size.width, opts.size.height,
                this.pos.x, this.pos.y, opts.size.width, opts.size.height
            );
        },
        mask: opts.mask,
        move: function (x, y) {
            this.pos.x = x;
            this.pos.y = y;
            this.mask.move(x, y);
        },
        shift: function (vx, vy) {
            this.pos.x += vx || this.speed.x;
            this.pox.y += vy || this.speed.y;
            this.mask.move(this.pos.x, this.pos.y);
        },
        collidesWith: function (other) {
            return this.mask.collidesWith(other.mask);
        },
        collide: BaseClass.Abstract
    };
}
