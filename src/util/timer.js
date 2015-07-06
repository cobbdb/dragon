var Item = require('../item.js'),
    Counter = require('./id-counter.js'),
    timeLastUpdate = global.Date.now(),
    clearSet = {},
    timeouts = [],
    timeoutsToAdd = [],
    intervals = [],
    intervalsToAdd = [];

/**
 * @class Timer
 * @extends Item
 */
module.exports = Item().extend({
    update: function () {
        var now = global.Date.now(),
            diff = now - timeLastUpdate,
            dormantTimeouts = [],
            dormantIntervals = [];

        // Debounce by a 3rd of a second.
        if (diff > 333) {
            // Process all the timeouts.
            timeouts.forEach(function (entry) {
                entry.life -= diff;
                if (entry.life <= 0) {
                    entry.event();
                } else {
                    dormantTimeouts.push(entry);
                }
            });
            timeouts = dormantTimeouts.concat(timeoutsToAdd);
            timeoutsToAdd = [];

            // Process all the intervals.
            intervals.forEach(function (entry) {
                entry.life -= diff;
                if (entry.life <= 0) {
                    entry.event();
                    entry.life = entry.delay;
                }
                if (!(entry.id in clearSet)) {
                    dormantIntervals.push(entry);
                }
            });
            intervals = dormantIntervals.concat(intervalsToAdd);
            intervalsToAdd = [];

            // Record time of this update.
            timeLastUpdate = now;
        }
    },
    /**
     * @param {Function} cb
     * @param {Number} delay
     * @param {Any} thisArg
     */
    setTimeout: function (cb, delay, thisArg) {
        timeoutsToAdd.push({
            event: cb.bind(thisArg),
            life: delay
        });
    },
    /**
     * @param {Function} cb
     * @param {Number} delay
     * @param {Any} thisArg
     * @return {Number}
     */
    setInterval: function (cb, delay, thisArg) {
        var hash = Counter.nextId;
        intervalsToAdd.push({
            event: cb.bind(thisArg),
            life: delay,
            delay: delay,
            id: hash
        });
        return hash;
    },
    /**
     * @param {Number} hash
     */
    clearInterval: function (hash) {
        clearSet[hash] = true;
    }
});
