/**
 * Bind() replacement. This is roughly
 * 10-20x faster than native Function.prototype.bind().
 */
module.exports = function (thisArg, func) {
    return function () {
        return func.apply(thisArg, arguments);
    };
};
