var i,
    len = 200,
    set = [],
    curr = 0;

for (i = 0; i < len; i += 1) {
    set.push(
        global.Math.random()
    );
}

/**
 * # random()
 * Fetch a random number in [0, 1).
 */
module.exports = function () {
    curr += 1;
    curr %= len;
    return set[curr];
};
