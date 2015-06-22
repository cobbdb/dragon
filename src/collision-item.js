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
        collisionSets = [].concat(opts.collisionSets || []);

    opts.on = opts.on || {};
    /**
     * So, basiclly shifting (speed) is fine, but
     * dragging - lastPos is not pos last frame, it
     * is the point where the drag was engaged.
     * dragging can't be treated the same as speed.
     */
    opts.on['colliding/$/solid'] = function (other) {
        // if (moved) {
        if (lastPos) {
            var C = this.mask.pos();
            var S = other.mask;
            var E = C.subtract(lastPos);
            if (E.x !== 0) {
                var m = E.y / E.x;
                var b = C.y - m * C.x;

                var pos = Point();
                pos.x = S.right;
                pos.y = m * pos.x + b;
                var R = Rectangle(pos.clone(), this.size);
                pos.x = S.x - this.size.width;
                pos.y = m * pos.x + b;
                var L = Rectangle(pos.clone(), this.size);
                pos.y = S.y - this.size.height;
                pos.x = (pos.y - b) / m;
                var T = Rectangle(pos.clone(), this.size);
                pos.y = S.bottom;
                pos.x = (pos.y - b) / m;
                var B = Rectangle(pos.clone(), this.size);

                var set = [R, L, T, B];
                set = set.filter(function (item) {
                    return item.intersects(S);
                });
            } else {
                var pos = Point();
                pos.x = C.x;
                pos.y = S.y - this.size.height;
                var T = Rectangle(pos.clone(), this.size);
                pos.x = C.x;
                pos.y = S.bottom;
                var B = Rectangle(pos.clone(), this.size);
                set = [T, B];
            }

            var A = set[0].pos().subtract(lastPos);
            A.multiply(A, true);
            var magA = A.x + A.y;
            var B = set[1].pos().subtract(lastPos);
            B.multiply(B, true);
            var magB = B.x + B.y;
            var target = (magA < magB) ? set[0] : set[1];
            this.move(target.pos());
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
            // moved = false;
            if (!newPos.equals(curPos)) {
                // moved = true;
                lastPos = curPos;
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
