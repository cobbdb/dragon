var Counter = require('./util/id-counter.js'),
    Rectangle = require('./geom/rectangle.js'),
    Vector = require('./geom/vector.js'),
    Item = require('./item.js'),
    Mouse = require('./io/mouse.js'),
    canvas = require('./io/canvas.js'),
    Set = require('./util/set.js');

/**
 * @class CollisionItem
 * @extends Item
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {Array Of CollisionHandler} [opts.collisions]
 * @param {Vector} [opts.offset]
 */
module.exports = function (opts) {
    var activeCollisions = {},
        collisionsThisFrame = {},
        updated = false;

    opts.collisions = Set.array(opts.collisions);
    opts.name = opts.name || '$:collidable';
    opts.kind = opts.kind || '$:collidable';

    return Item(opts).extend({
        _create: function () {
            this.on('$collide#screendrag', function () {
                var that = this; // <-- Garbage
                if (!this.dragging) {
                    this.dragging = true;
                    Mouse.on('$up', function () {
                        that.dragging = false;
                    });
                }
            });
        },
        id: Counter.nextId(),
        dragging: false,
        mask: opts.mask || Rectangle(),
        offset: opts.offset || Vector(),
        /**
         * @return {Boolean} True if in the viewport.
         */
        onscreen: function () {
            return this.intersects(canvas.mask);
        },
        /**
         * Move the mask.
         * @param {Point} pos
         */
        move: function (pos) {
            this.mask.moveFixed(
                pos.x + this.offset.x,
                pos.y + this.offset.y
            );
        },
        /**
         * Move the mask.
         * @param {Number} x
         * @param {Number} y
         */
        moveFixed: function (x, y) {
            this.mask.moveFixed(
                x + this.offset.x,
                y + this.offset.y
            );
        },
        /**
         * Moves flush against another CollisionItem in the
         * direction of the nearest side.
         * @param {Collidable} other
         */
        flush: function (other) {
            var top = this.mask.bottom - other.mask.top,
                right = other.mask.right - this.mask.left,
                bottom = other.mask.bottom - this.mask.top,
                left = this.mask.right - other.mask.left,
                min = global.Math.min(top, right, bottom, left),
                targetx = this.pos.x,
                targety = this.pos.y;

            if (min === top) {
                targety = other.mask.y - this.mask.height;
            } else if (min === right) {
                targetx = other.mask.right;
            } else if (min === bottom) {
                targety = other.mask.bottom;
            } else {
                targetx = other.mask.x - this.mask.width;
            }
            this.moveFixed(targetx, targety);
        },
        /**
         * @param {Shape} mask
         */
        intersects: function (mask) {
            return this.mask.intersects(mask);
        },
        update: function () {
            var i, len;

            if (!updated) {
                updated = true;
                len = opts.collisions.length;
                for (i = 0; i < len; i += 1) {
                    opts.collisions[i].update(this);
                }
            }
        },
        teardown: function () {
            updated = false;
            collisionsThisFrame = {}; // <-- Garbage
        },
        /**
         * @param {Number} id
         */
        addCollision: function (id) {
            activeCollisions[id] = true;
            collisionsThisFrame[id] = true;
        },
        /**
         * @param {Number} id
         */
        removeCollision: function (id) {
            activeCollisions[id] = false;
        },
        clearCollisions: function () {
            activeCollisions = {}; // <-- Garbage
        },
        /**
         * @param {Number} id
         */
        isCollidingWith: function (id) {
            return activeCollisions[id] || false;
        },
        /**
         * @param {Number} id
         */
        canCollideWith: function (id) {
            var self = this.id === id,
                already = collisionsThisFrame[id];
            return !self && !already;
        }
    });
};
