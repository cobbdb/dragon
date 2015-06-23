var Counter = require('./util/id-counter.js'),
    Rectangle = require('./geom/rectangle.js'),
    Point = require('./geom/point.js'),
    Item = require('./item.js'),
    Mouse = require('./io/mouse.js');

/**
 * @class CollisionItem
 * @extends Item
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {Boolean} [opts.solid] True to collide with other
 * solid sprites.
 * @param {Array|CollisionHandler} [opts.collisionSets]
 */
module.exports = function (opts) {
    var activeCollisions = {},
        collisionsThisFrame = {},
        updated = false,
        lastPos,
        moved = false,
        collisionSets = [].concat(opts.collisionSets || []);

    opts.on = opts.on || {};
    /**
     * @param {CollisionItem} other
     */
    opts.on['colliding/$/solid'] = function (other) {
        // if (moved) needs to go away.. too situational
        if (moved) {
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
        }
    };

    // Provide easy way to track when dragged.
    opts.on['collide/screendrag'] = [].concat(
        opts.on['collide/screendrag'] || [],
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
        name: opts.name || 'dragon-collidable',
        dragging: false,
        solid: opts.solid || false,
        mask: opts.mask || Rectangle(),
        offset: opts.offset || Point(),
        /**
         * Move the mask.
         * @param {Point} pos
         */
        move: function (pos) {
            var curPos = this.mask.pos(),
                newPos = pos.add(this.offset);
            if (!newPos.equals(curPos)) {
                moved = true;
                this.mask.move(newPos);
            }
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
                    handler.update(this);
                }, this);
            }
        },
        teardown: function () {
            moved = false;
            updated = false;
            collisionsThisFrame = {};
        },
        addCollision: function (id) {
            activeCollisions[id] = true;
            collisionsThisFrame[id] = true;
        },
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
        canCollideWith: function (id) {
            var self = this.id === id,
                already = collisionsThisFrame[id];
            return !self && !already;
        }
    });
};
