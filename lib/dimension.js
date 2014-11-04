var BaseClass = require('baseclassjs');

module.exports = function (w, h) {
    return BaseClass({
        width: w || 0,
        height: h || 0
    });
};
