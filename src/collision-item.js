var Counter = require('./util/id-counter.js'),
    Rectangle = require('./geom/rectangle.js'),
    Vector = require('./geom/vector.js'),
    Item = require('./item.js'),
    Mouse = require('./io/mouse.js'),
    canvas = require('./io/canvas.js'),
    Util = require('./util/object.js');

/**
 * @class CollisionItem
 * @extends Item
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {Array|CollisionHandler} [opts.collisions]
 * @param {Vector} [offset]
 */
module.exports = function (opts) {
    var activeCollisions = {},
        collisionsThisFrame = {},
        updated = false,
        collisionSets = [].concat(opts.collisions || []);

    opts = Util.mergeDefaults(opts, {
        name: '$:collidable',
        kind: '$:collidable',
        on: {}
    });

    // Provide easy way to track when dragged.
    // !!!!! Mouse.on is considered unsafe.
    opts.on['$collide#screendrag'] = [].concat(
        opts.on['$collide#screendrag'] || [],
        function () {
            if (!this.dragging) {
                this.dragging = true;
                Mouse.on.up(function () {
                    this.dragging = false;
                }, this);
            }
        }
    );

    return Item(opts).extend({
        id: Counter.nextId,
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
            this.mask.move(
                pos.add(this.offset)
            );
        },
        /**
         * Moves flush against another CollisionItem in the
         * direction of the nearest side.
         * @param {CollisionItem} other
         */
        flush: function (other) {
            var top = this.mask.bottom - other.mask.top,
                right = other.mask.right - this.mask.left,
                bottom = other.mask.bottom - this.mask.top,
                left = this.mask.right - other.mask.left,
                min = global.Math.min(top, right, bottom, left),
                target = this.pos.clone();
            switch (min) {
                case top:
                    target.y = other.mask.y - this.mask.height;
                    break;
                case right:
                    target.x = other.mask.right;
                    break;
                case bottom:
                    target.y = other.mask.bottom;
                    break;
                default:
                    target.x = other.mask.x - this.mask.width;
                    break;
            }
            this.move(target);
        },
        /**
         * @param {Shape} mask
         */
        intersects: function (mask) {
            return this.mask.intersects(mask);
        },
        update: function () {
            if (!updated) {
                updated = true;
                collisionSets.forEach(function (handler) {
                    try{handler.update(this);}
                    catch (err) {
                        var thing = 123;
                    }
                }, this);
            }
        },
        teardown: function () {
            updated = false;
            collisionsThisFrame = {};
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
            activeCollisions = {};
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
