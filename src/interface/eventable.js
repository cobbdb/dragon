var BaseClass = require('baseclassjs');

/**
 * @param {Map Of Functions} [opts.on] Dictionary of events.
 * @param {Map of Functions} [opts.one] Dictionary of one-time events.
 */
module.exports = function (opts) {
    var events = {},
        singles = {},
        name;

    opts = opts || {};
    for (name in opts.events) {
        events[name] = [].concat( // <-- Garbage
            opts.events[name]
        );
    }
    for (name in opts.singles) {
        singles[name] = [].concat( // <-- Garbage
            opts.singles[name]
        );
    }

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
