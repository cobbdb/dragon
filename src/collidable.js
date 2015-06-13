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

    function classify(E, S) {
        return {
            x: (E.x - S.x > 0) ? 'right' : 'left',
            y: (E.y - S.y > 0) ? 'down' : 'up'
        };
    }
    function magnitude(clas, O, T) {
        var a = Math.abs(O.bottom - T.top),
            b = Math.abs(O.top - T.bottom),
            c = Math.abs(O.right - T.left),
            d = Math.abs(O.left - T.right);
        return {
            x1: (clas.x === 'right') ? c : d,
            y1: (clas.y === 'down') ? a : b
        };
    }
    function slope(E) {
        return E.y / E.x;
    }
    function lerp(type, m, T, O) {
        if (type === 'theta') {
            O.y = T.top - O.height;
            O.x = O.y / m;
        } else if (type === 'beta') {
            O.y = T.bottom;
            O.x = O.y / m;
        } else if (type === 'phi') {
            O.x = T.left - O.width;
            O.y = m * O.x;
        } else if (type === 'eta') {
            O.x = T.right;
            O.y = m * O.x;
        }
    }
    function flush(f, p, s, m, T, O) {
        if (f) {
            if (p) {
                lerp('theta', m, T, O);
            } else {
                lerp('beta', m, T, O);
            }
        } else {
            if (s) {
                lerp('phi', m, T, O);
            } else {
                lerp('eta', m, T, O);
            }
        }
    }
    opts.on = opts.on || {};
    opts.on['colliding/$/solid'] = function (other) {
        if (lastPos) {
            //flush();
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
                lastPos = curPos.subtract(this.offset);
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
