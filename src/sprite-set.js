var Counter = require('./util/id-counter.js'),
    Collection = require('./collection.js');

/**
 * # Sprite Set
 * Item Collection specifically for handing Sprites.
 * @return {SpriteSet}
 */
module.exports = function (opts) {
    var spritesToAdd = [],
        loadQueue = {};

    return Collection(opts).extend({
        add: function (opts) {
            var id, onload, set, addQueue,
                thatbase = this.base;
            opts = opts || {};
            onload = opts.onload || function () {};
            set = [].concat(opts.set);

            if (set.length) {
                id = Counter.nextId;
                loadQueue[id] = set.length;
                set.forEach(function (sprite) {
                    sprite.removed = false;
                    sprite.load(function () {
                        loadQueue[id] -= 1;
                        if (loadQueue[id] === 0) {
                            spritesToAdd = spritesToAdd.concat(set);
                            if (opts.force) {
                                addQueue = spritesToAdd;
                                spritesToAdd = [];
                                thatbase.add(addQueue);
                            }
                            onload();
                        }
                    });
                });
            } else {
                onload();
            }
        },
        update: function () {
            var addQueue;
            this.base.update();

            addQueue = spritesToAdd;
            spritesToAdd = [];
            this.base.add(addQueue);
        }
    });
};
