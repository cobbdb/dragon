var BaseClass = require('baseclassjs'),
    Set = require('./util/set.js');

/**
 * @param {Map Of Function|Map Of Array Of Function} [opts.on]
 * @param {Map of Function|Map Of Array Of Function} [opts.one]
 */
module.exports = function (opts) {
    var events, singles, name;
    opts = opts || {};

    // Convert events to Array.
    for (name in opts.on) {
        opts.on[name] = Set.array(
            opts.on[name]
        );
    }
    events = opts.on || {};

    // Convert singles to Array.
    for (name in opts.one) {
        opts.one[name] = Set.array(
            opts.one[name]
        );
    }
    singles = opts.one || {};

    return BaseClass({
        on: function (name, cb) {
            events[name] = events[name] || [];
            events[name].push(cb);
        },
        one: function (name, cb) {
            singles[name] = singles[name] || [];
            singles[name].push(cb);
        },
        off: function (name) {
            events[name].length = 0;
            singles[name].length = 0;
        },
        trigger: function (name, data) {
            var i, len;

            if (name in events) {
                len = events[name].length;
                for (i = 0; i < len; i += 1) {
                    events[name][i].call(this, data);
                }
            }

            if (name in singles) {
                len = singles[name].length;
                for (i = 0; i < len; i += 1) {
                    singles[name][i].call(this, data);
                }
                singles[name].length = 0;
            }
        }
    });
};
