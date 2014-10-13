module.exports = function (w, h) {
    return {
        extend: require('baseclassjs'),
        width: w || 0,
        height: h || 0
    };
};
