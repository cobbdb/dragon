var BaseClass = require('baseclassjs');

/**
 * @param {Object} [opts.events]
 * @param {Object} [opts.singles]
 */
module.exports = function (opts) {
    var events = {},
        singles = {},
        name;

    opts = opts || {};
    for (name in opts.events) {
        events[name] = [].concat(
            opts.events[name]
        );
    }
    for (name in opts.singles) {
        singles[name] = [].concat(
            opts.singles[name]
        );
    }

    return BaseClass.Interface({
        on: function (name, cb) {
            events[name] = events[name] || [];
            events[name].push(cb);
        },
        one: function (name, cb) {
            singles[name] = singles[name] || [];
            singles[name].push(cb);
        },
        off: function (name) {
            events[name] = [];
            singles[name] = [];
        },
        trigger: function (name, data) {
            if (name in events) {
                events[name].forEach(function (cb) {
                    cb.call(this, data);
                }, this);
            }
            if (name in singles) {
                singles[name].forEach(function (cb) {
                    cb.call(this, data);
                }, this);
                singles[name] = [];
            }
        }
    });
};
