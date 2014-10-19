var curb = require('curb'),
    BaseClass = require('baseclassjs');

function BaseClass2(root) {
    root.leaf = root;
    root.extend = function (child) {
        var key,
            base = {};
        child = child || {};
        for (key in this) {
            if (typeof this[key] === 'function') {
                base[key] = this[key].bind(base);
            } else {
                base[key] = this[key];
            }
        }
        for (key in child) {
            this[key] = child[key];
            if (typeof child[key] !== 'function') {
                base[key] = child[key];
            }
        }
        this.base = base;
        return this;
    };
    return root;
}

BaseClass2.Abstract = function () {
    throw Error('[BaseClass] Abstract method was called without definition.');
};
 
BaseClass2.Stub = function () {};


CollisionEngine = (function () {
    var sprites = [];
    return {
        update: function (sprite) {
            sprites.push(sprite);
        },
        handleCollisions: function () {
            var i, j,
                len = sprites.length;
            for (i = 0; i < len; i += 1) {
                for (j = 0; j < len; j += 1) {
                    if (i !== j) {
                        sprites[i].collideWith(sprites[j]);
                    }
                }
            }
        }
    };
}());

Collidable = function (opts) {
    return BaseClass2({
        collideWith: function () {
            console.error('[Collidable] Inheritance error!');
        },
        collisionWith: opts.collisionWith,
        update: function () {
            console.log('Collidable.update():');
            //console.log(Object.keys(this));
            CollisionEngine.update(this.leaf);
        },
        go: function () {
            console.log('Collidable.go()');
        }
    });
};

Sprite = function (x, y, opts) {
    return Collidable(opts).extend({
        x: x,
        y: y,
        collideWith: function () {
            console.error('[Sprite] Inheritance error!');
        },
        update: function () {
            console.log('Sprite.update():');
            //console.log(Object.keys(this));
            this.base.update();
        },
        go: function () {
            console.log('Sprite.go()');
        }
    });
};

Missle = function (dmg, x, y) {
    var self = Sprite(x, y, {
        collisionWith: {
            Missle: function (other) {
                console.log(
                    curb('(%s,%s) Hit for %s!', self.x, self.y, other.damage)
                );
            }
        }
    }).extend({
        damage: dmg,
        collideWith: function (other) {
            return other.collisionWith.Missle(this);
        },
        go: function () {
            console.log('Missle.go()');
        },
        update: function () {
            console.log('Missle.update():');
            //console.log(Object.keys(this));
            this.base.update();
        }
    });
    return self;
};


rocket1 = Missle(1337, 12, -34);
rocket2 = Missle(8008, -98, 76);

rocket1.go();
rocket1.base.go();
rocket1.base.base.go();
console.log();

rocket1.update();
console.log();

rocket2.update();

CollisionEngine.handleCollisions();
