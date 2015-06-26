var Item = require('./item.js'),
    Util = require('./util/object.js');

/**
 * @class Collection
 * Item Collections are sets of Items with methods for
 * for manipulating Items.
 * @extends Item
 */
module.exports = function (opts) {
    var removed = false;

    Util.mergeDefaults(opts, {
        name: 'dragon-collection',
        kind: 'dragon-collection'
    });

    return Item(opts).extend({
        set: [],
        map: {},
        /**
         * @param {Array Of Items} items
         */
        add: function (items) {
            if (items.length) {
                items.forEach(function (item) {
                    this.set.push(item);
                    this.map[item.name] = item;
                    item.trigger('ready');
                }, this);
                // Larger depth value is closer to viewer.
                this.set.sort(function (a, b) {
                    return a.depth - b.depth;
                });
            }
            return this;
        },
        /**
         * @param {String} name
         */
        remove: function (name) {
            this.map[name].removed = true;
            removed = true;
        },
        clear: function () {
            this.set = [];
            this.map = {};
        },
        /**
         * @param {String} name
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
