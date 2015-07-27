var counter = 0;

module.exports = {
    lastId: function () {
        return counter;
    },
    nextId: function () {
        counter += 1;
        return counter;
    }
};
