var Counter = require('./id-counter.js'),
    Collection = require('./collection.js');

module.exports = function () {
    var spritesToAdd = [],
        loadQueue = {};

    return Collection().extend({
        add: function (opts) {
            var id, onload, set,
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
                                thatbase.add(spritesToAdd);
                                spritesToAdd = [];
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
            this.base.update();
            this.base.add(spritesToAdd);
            spritesToAdd = [];
        }
    });
};
