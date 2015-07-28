var ZERO = require('./zero.js');

/**
 * @class Dimension
 * @param {Number} w
 * @param {Number} h
 */
module.exports = function (w, h) {
    return {
        width: w || 0,
        height: h || 0,
        clone: function () {
            return module.exports(this.width, this.height);
        },
        set: function (other) {
            this.width = other.width;
            this.height = other.height;
            return this;
        },
        setFixed: function (w, h) {
            this.width = w;
            this.height = h;
            return this;
        },
        equals: function (other) {
            return (
                this.width === other.width &&
                this.height === other.height
            );
        },
        /**
         * @return {Dimension}
         */
        floor: function () {
            this.width = global.Math.floor(this.width);
            this.height = global.Math.floor(this.height);
            return this;
        },
        /**
         * @return {Boolean}
         */
        isZero: function () {
            return this.equals(ZERO);
        },
        /**
         * @param {Dimension} scale
         * @return {Dimension}
         */
        multiply: function (scale) {
            this.width *= scale.width;
            this.height *= scale.height;
            return this;
        },
        /**
         * @param {Number} w
         * @param {Number} h
         * @return {Dimension}
         */
        multiplyFixed: function (w, h) {
            this.width *= w;
            this.height *= h;
            return this;
        },
        divide: function (scale) {
            this.width /= scale.width;
            this.height /= scale.height;
            return this;
        },
        divideFixed: function (w, h) {
            this.width /= w;
            this.height /= h;
            return this;
        },
        add: function (scale) {
            this.width += scale.width;
            this.height += scale.height;
            return this;
        },
        addFixed: function (w, h) {
            this.width += w;
            this.height += h;
            return this;
        },
        subtract: function (scale) {
            this.width -= scale.width;
            this.height -= scale.height;
            return this;
        },
        subtractFixed: function (w, h) {
            this.width -= w;
            this.height -= h;
            return this;
        }
    };
};
