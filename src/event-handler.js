var BaseClass = require('baseclassjs');

module.exports = function (opts) {
    var events = opts.events || {},
        singles = opts.singles || {};

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
            if (events[name]) {
                events[name].forEach(function (cb) {
                    cb(data);
                });
            }
            if (singles[name]) {
                singles[name].forEach(function (cb) {
                    cb(data);
                });
                single[name] = [];
            }
        }
    });
};
