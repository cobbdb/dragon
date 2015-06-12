/**
 * # Dimension
 * @param {Number} w
 * @param {Number} h
 * @return {Dimension}
 */
function Dimension(w, h) {
    return {
        width: w || 0,
        height: h || 0,
        clone: function () {
            return Dimension(this.width, this.height);
        },
        equals: function (other) {
            return (
                this.width === other.width &&
                this.height === other.height
            );
        },
        /**
         * @param {Dimension} scale
         */
        multiply: function (scale) {
            this.width *= scale.width;
            this.height *= scale.height;
            return this;
        },
        divide: function (scale) {
            this.width /= scale.width;
            this.height /= scale.height;
            return this;
        },
        add: function (scale) {
            this.width += scale.width;
            this.height += scale.height;
            return this;
        },
        subtract: function (scale) {
            this.width -= scale.width;
            this.height -= scale.height;
            return this;
        }
    };
}

module.exports = Dimension;
