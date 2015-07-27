var Counter = require('./id-counter.js'),
    timeLastUpdate = global.Date.now(),
    clearSet = {},
    timeouts = [],
    timeoutsToAdd = [],
    intervals = [],
    intervalsToAdd = [];

/**
 * Replacement for native window timer.
 */
module.exports = {
    update: function () {
        var i, entry, len,
            now = global.Date.now(),
            diff = now - timeLastUpdate;

        // Process all the timeouts.
        len = timeouts.length;
        for (i = 0; i < len; i += 1) {
            entry = timeouts[i];
            if (entry.id in clearSet) {
                timeouts.splice(i, 1);
                i -= 1;
                len -= 1;
            } else {
                entry.life -= diff;
                if (entry.life <= 0) {
                    entry.event.call(entry.thisArg, -entry.life);
                    clearSet[entry.id] = true;
                }
            }
        }
        timeouts.push.apply(timeouts, timeoutsToAdd);
        timeoutsToAdd.length = 0;

        // Process all the intervals.
        len = intervals.length;
        for (i = 0; i < len; i += 1) {
            entry = intervals[i];
            if (entry.id in clearSet) {
                intervals.splice(i, 1);
                i -= 1;
                len -= 1;
            } else {
                entry.life -= diff;
                if (entry.life <= 0) {
                    entry.event.call(entry.thisArg, -entry.life);
                    entry.life = entry.delay;
                }
            }
        }
        intervals.push.apply(intervals, intervalsToAdd);
        intervalsToAdd.length = 0;

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
        var hash = Counter.nextId();
        timeoutsToAdd.push({
            event: cb,
            thisArg: thisArg,
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
        var hash = Counter.nextId();
        intervalsToAdd.push({
            event: cb,
            thisArg: thisArg,
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
};
