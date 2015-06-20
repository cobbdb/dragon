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
    opts.on['colliding/$/solid'] = function (other) {
        if (lastPos) {
            var C = this.mask.pos();
            var S = other.mask;
            var E = C.subtract(lastPos);
            var m = E.y / E.x;
            var b = C.y - m * C.x;

            var R = Point();
            R.x = S.right;
            R.y = m * R.x + b;
            var L = Point();
            L.x = S.x - this.size.width;
            L.y = m * L.x + b;
            var T = Point();
            T.y = S.y - this.size.height;
            T.x = (T.y - b) / m;
            var B = Point();
            B.y = S.bottom;
            B.x = (B.y - b) / m;

            var W = R.subtract(lastPos);
            var X = L.subtract(lastPos);
            var Y = T.subtract(lastPos);
            var Z = B.subtract(lastPos);

            var set = [W, X, Y, Z];
            function sqr(num) {
                return num * num;
            }
            set.sort(function (a, b) {
                var A = sqr(a.x) + sqr(a.y),
                    B = sqr(b.x) + sqr(b.y);
                return A - B;
            });
            this.move(set[1]);
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
                //lastPos = curPos.subtract(this.offset);
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
