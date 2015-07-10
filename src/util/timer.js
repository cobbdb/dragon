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

        // Process all the timeouts.
        timeouts.forEach(function (entry) {
            if (!(entry.id in clearSet)) {
                entry.life -= diff;
                if (entry.life <= 0) {
                    entry.event(-entry.life);
                } else {
                    dormantTimeouts.push(entry);
                }
            }
        });
        timeouts = dormantTimeouts.concat(timeoutsToAdd);
        timeoutsToAdd = [];

        // Process all the intervals.
        intervals.forEach(function (entry) {
            if (!(entry.id in clearSet)) {
                entry.life -= diff;
                if (entry.life <= 0) {
                    entry.event(-entry.life);
                    entry.life = entry.delay;
                }
                dormantIntervals.push(entry);
            }
        });
        intervals = dormantIntervals.concat(intervalsToAdd);
        intervalsToAdd = [];

        // Record time of this update.
        timeLastUpdate = now;
    },
    /**
     * @param {Function} cb
     * @param {Number} delay
     * @param {Any} thisArg
     * @return {Number}
     */
    setTimeout: function (cb, delay, thisArg) {
        var hash = Counter.nextId;
        timeoutsToAdd.push({
            event: cb.bind(thisArg),
            life: delay,
            id: hash
        });
        return hash;
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
    clear: function (hash) {
        clearSet[hash] = true;
    }
});
