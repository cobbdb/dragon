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
        equals: function (other) {
            return (
                this.width === other.width &&
                this.height === other.height
            );
        },
        is: {
            /**
             * @return {Boolean}
             */
            get zero () {
                return this.equals(ZERO);
            }
        },
        /**
         * @param {Dimension} scale
         * @param {Boolean} [shallow] True to mutate.
         * @return {Dimension}
         */
        multiply: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.width *= scale.width;
            target.height *= scale.height;
            return target;
        },
        divide: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.width /= scale.width;
            target.height /= scale.height;
            return target;
        },
        add: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.width += scale.width;
            target.height += scale.height;
            return target;
        },
        subtract: function (scale, shallow) {
            var target = shallow ? this : this.clone();
            target.width -= scale.width;
            target.height -= scale.height;
            return target;
        }
    };
};
