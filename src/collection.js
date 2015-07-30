var Item = require('./item.js'),
    Set = require('./util/set.js');

/**
 * @class Collection
 * @extends Item
 * Item Collections are sets of Items with methods for
 * for manipulating Items.
 * @param {Boolean} [sorted] Defaults to true. False if
 * items should not be ordered by depth.
 */
module.exports = function (opts) {
    var removed = false;

    opts.name = opts.name || '$:collection';
    opts.kind = opts.kind || '$:collection';

    return Item(opts).extend({
        sorted: ('sorted' in opts) ? opts.sorted : true,
        set: [],
        map: {},
        /**
         * @param {Array|Item} set
         * @return {Collection} This collection.
         */
        add: function (set) {
            var i, len, item;

            if (set) {
                set = Set.array(set);
                len = set.length;
                for (i = 0; i < len; i += 1) {
                    item = set[i];
                    item.removed = false;
                    this.set.push(item);
                    this.map[item.name] = item;
                    item.trigger('$added');
                }
                if (this.sorted) {
                    // Larger depth value is closer to viewer.
                    this.set.sort(function (a, b) {
                        return a.depth - b.depth;
                    });
                }
            }
            return this;
        },
        /**
         * @param {Item} item
         */
        remove: function (item) {
            item.removed = true;
            removed = true;
        },
        /**
         * Hard reset the entire Collection.
         */
        clear: function () {
            this.set.length = 0;
            this.map = {};
        },
        /**
         * @param {String} name
         * @return {Item}
         */
        get: function (name) {
            return this.map[name];
        },
        update: function () {
            var i, item, len = this.set.length;

            for (i = 0; i < len; i += 1) {
                item = this.set[i];
                if (this.updating && item.updating && !item.removed) {
                    item.update();
                }
            }
        },
        draw: function (ctx) {
            var i, item, len = this.set.length;

            for (i = 0; i < len; i += 1) {
                item = this.set[i];
                if (this.drawing && item.drawing && !item.removed) {
                    ctx.globalAlpha = 1;
                    ctx.resetTransform();
                    item.draw(ctx);
                }
            }
        },
        teardown: function () {
            var i, item, len = this.set.length;

            for (i = 0; i < len; i += 1) {
                item = this.set[i];
                if (this.updating && item.updating && !item.removed) {
                    item.teardown();
                }
            }
            if (removed) {
                // Remove any stale sprites.
                this.set = this.set.filter(function (item) {
                    // true to keep, false to drop.
                    return !item.removed;
                });
                removed = false;
            }
        }
    });
};
