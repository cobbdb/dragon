var Item = require('./item.js'),
    Obj = require('./util/object.js');

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

    opts = Obj.mergeDefaults(opts, {
        name: 'dragon-collection',
        kind: 'dragon-collection'
    });

    return Item(opts).extend({
        sorted: ('sorted' in opts) ? opts.sorted : true,
        set: [],
        map: {},
        /**
         * @param {Array|Item} set
         * @return {Collection} This collection.
         */
        add: function (set) {
            if (set) {
                set = [].concat(set);
                set.forEach(function (item) {
                    item.removed = false;
                    this.set.push(item);
                    this.map[item.name] = item;
                    item.trigger('$added');
                }, this);
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
            this.set = [];
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
            this.set.forEach(function (item) {
                if (this.updating && item.updating && !item.removed) {
                    item.update();
                }
            }, this);
        },
        draw: function (ctx) {
            this.set.forEach(function (item) {
                if (this.drawing && item.drawing && !item.removed) {
                    ctx.globalAlpha = 1;
                    item.draw(ctx);
                }
            }, this);
        },
        teardown: function () {
            this.set.forEach(function (item) {
                if (this.updating && item.updating && !item.removed) {
                    item.teardown();
                }
            }, this);
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
