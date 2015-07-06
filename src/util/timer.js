var Item = require('../item.js'),
    Counter = require('./id-counter.js');

//module.exports = function () {
    var timeLastSecond = global.Date.now(),
        clearSet = {},
        timeouts = [],
        intervals = [];

    module.exports = Item().extend({
        update: function () {
            var now = global.Date.now(),
                diff = now - timeLastSecond,
                filteredTimeouts = [],
                filteredIntervals = [],
                hash;
            if (diff >= 1000) {
                timeouts.forEach(function (entry) {
                    entry.life -= diff;
                    if (entry.life <= 0) {
                        entry.event();
                    } else {
                        filteredTimeouts.push(entry);
                    }
                });
                timeouts = filteredTimeouts;

                intervals.forEach(function (entry) {
                    entry.life -= diff;
                    hash = entry.id;
                    if (entry.life <= 0) {
                        entry.event();
                        entry.life = entry.delay;
                    }
                    if (hash in clearSet) {
                        clearSet[hash] = false;
                    } else {
                        filteredIntervals.push(entry);
                    }
                });
                intervals = filteredIntervals;

                timeLastSecond = now;
            }
        },
        setTimeout: function (cb, delay, thisArg) {
            timeouts.push({
                event: cb.bind(thisArg),
                life: delay
            });
        },
        setInterval: function (cb, delay, thisArg) {
            var hash = Counter.nextId;
            intervals.push({
                event: cb.bind(thisArg),
                life: delay,
                delay: delay,
                id: hash
            });
            return hash;
        },
        clearInterval: function (hash) {
            clearSet[hash] = true;
        }
    });
//};
