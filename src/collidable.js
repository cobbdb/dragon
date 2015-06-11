var Counter = require('./id-counter.js'),
    EventHandler = require('./event-handler.js'),
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
        lastPos = Point();

    if (opts.collisionSets) {
        collisionSets = [].concat(opts.collisionSets);
    }

    opts.on = opts.on || {};
    opts.on['dragon/colliding/solid'] = function (other) {
            if (this.name === 'drag' && lastPos.x !== this.pos.x) {
                var logit = true;
                console.debug('>>>', lastPos.x, lastPos.y);
            }
        this.move(
            lastPos.x,
            lastPos.y
        );
            if (logit)
                console.debug('\t>', lastPos.x, lastPos.y);
    };

    return Item().extend({
        id: Counter.nextId,
        name: opts.name || 'dragon-collidable',
        solid: opts.solid || false,
        mask: opts.mask || Rectangle(),
        offset: opts.offset || Point(),
        move: function (pos) {
            lastPos = this.mask.pos();
            this.mask.move(
                pos.x + this.offset.x,
                pos.y + this.offset.y
            );
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
    }).implement(
        EventHandler({
            events: opts.on,
            singles: opts.one
        })
    );
};
