var Counter = require('./id-counter.js'),
    Rectangle = require('./rectangle.js'),
    Point = require('./point.js'),
    Item = require('./item.js');

/**
 * @param {Shape} [opts.mask] Defaults to Rectangle.
 * @param {String} [opts.name]
 * @param {Boolean} [opts.solid] True to collide with other
 * solid sprites.
 * @param {Array|CollisionHandler} [opts.collisionSets]
 * @param {Map Of Functions} [opts.on] Dictionary of events.
 * @param {Map of Functions} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var activeCollisions = {},
        collisionsThisFrame = {},
        collisionSets = [],
        updated = false,
        lastPos;

    if (opts.collisionSets) {
        collisionSets = [].concat(opts.collisionSets);
    }

    function classify(E) {
        return {
            x: (E.x > 0) ? 'right' : 'left',
            y: (E.y > 0) ? 'down' : 'up'
        };
    }
    function magnitude(clas, T, O) {
        var a = Math.abs(T.bottom - O.top),
            b = Math.abs(T.top - O.bottom),
            c = Math.abs(T.right - O.left),
            d = Math.abs(T.left - O.right);
        return {
            x1: (clas.x === 'right') ? c : d,
            y1: (clas.y === 'down') ? a : b
        };
    }
    function flush(f, p, s, m, T, O) {
        var target = Point(),
            b = T.y - m * T.x;
        if (f) {
            if (p) { // down
                // theta
                target.y = O.top - T.height;
                target.x = (target.y - b) / m;
            } else { // up
                // beta
                target.y = O.bottom;
                target.x = (target.y - b) / m;
            }
        } else {
            if (s) { // right
                // phi
                target.x = O.left - T.width;
                target.y = m * target.x + b;
            } else { // left
                // eta
                target.x = O.right;
                target.y = m * target.x + b;
            }
        }
        return target;
    }
    opts.on = opts.on || {};
    opts.on['colliding/$/solid'] = function (other) {
        if (lastPos) {
            var E = this.mask.pos().subtract(lastPos);
            var m = E.y / E.x;
            var clas = classify(E);
            var mag = magnitude(clas, this.mask, other.mask);
            var f = mag.y1 < mag.x1;
            var p = clas.x === 'right';
            var s = clas.y === 'down';
            var T = this.mask;
            var O = other.mask;
            var target = flush(f, p, s, m, T, O);
            this.move(target);
        }
    };

    return Item(opts).extend({
        id: Counter.nextId,
        name: opts.name || 'dragon-collidable',
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
