var BaseClass = require('baseclassjs'),
    curb = require('curb');

CollisionEngine = (function () {
    var sprites = [];
    return {
        reset: function () {
            sprites = [];
        },
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
    return {
        extend: BaseClass,
        collideWith: function () {
            console.error('[Collidable] Inheritance error!');
        },
        collisionWith: opts.collisionWith,
        update: function () {
            CollisionEngine.update(this);
        }
    };
};

Sprite = function (opts) {
    return Collidable(opts).extend({
        x: 193,
        y: -23,
        update: function () {
            this.base.update();
        }
    });
};

Missle = function (dmg) {
    return Sprite({
        collisionWith: {
            Missle: function (other) {
                console.log(
                    curb('(%s,%s) Hit for %s!', this.x, this.y, other.damage)
                );
            }
        }
    }).extend({
        damage: dmg,
        collideWith: function (other) {
            return other.collisionWith.Missle(this);
        }
    });
};


rocket1 = Missle(1337);
rocket2 = Missle(8008);

rocket1.update();
rocket2.update();

CollisionEngine.handleCollisions();
