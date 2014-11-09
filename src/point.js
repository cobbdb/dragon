module.exports = function (x, y) {
    return {
        extend: require('baseclassjs'),
        x: x || 0,
        y: y || 0
    };
};
