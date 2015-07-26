var ZERO = require('./zero.js');

/**
 * @class Dimension
 * @param {Number} w
 * @param {Number} h
 */
module.exports = function (w, h) {
    var self = {
        width: w || 0,
        height: h || 0,
        clone: function () {
            return module.exports(this.width, this.height); // <-- MEMORY LEAK
        },
        equals: function (other) {
            return (
                this.width === other.width &&
                this.height === other.height
            );
        },
        /**
         * @param {Boolean} mutate
         * @return {Dimension}
         */
        floor: function (mutate) {
            var target = mutate ? this : this.clone(); // <-- MEMORY LEAK
            target.width = global.Math.floor(target.width);
            target.height = global.Math.floor(target.height);
            return target;
        },
        is: {
            /**
             * @return {Boolean}
             */
            get zero () {
                return self.equals(ZERO); // <-- MEMORY LEAK
            }
        },
        /**
         * @param {Dimension} scale
         * @param {Boolean} [shallow] True to mutate.
         * @return {Dimension}
         */
        multiply: function (scale, shallow) {
            var target = shallow ? this : this.clone(); // <-- MEMORY LEAK
            target.width *= scale.width;
            target.height *= scale.height;
            return target;
        },
        divide: function (scale, shallow) {
            var target = shallow ? this : this.clone(); // <-- MEMORY LEAK
            target.width /= scale.width;
            target.height /= scale.height;
            return target;
        },
        add: function (scale, shallow) {
            var target = shallow ? this : this.clone(); // <-- MEMORY LEAK
            target.width += scale.width;
            target.height += scale.height;
            return target;
        },
        subtract: function (scale, shallow) {
            var target = shallow ? this : this.clone(); // <-- MEMORY LEAK
            target.width -= scale.width;
            target.height -= scale.height;
            return target;
        }
    };
    return self;
};
