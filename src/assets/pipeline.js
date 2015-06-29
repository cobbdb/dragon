var Util = require('../util/object.js'),
    Img = require('./image.js'),
    Audio = require('./audio.js'),
    Font = require('./font.js'),
    Game = require('../game.js'),
    count = 0,
    onload = function () {
        count -= 1;
    },
    cache = {
        image: {},
        audio: {},
        font: {}
    };

module.exports = {
    /**
     * @return {Boolean}
     */
    get ready () {
        return count === 0;
    },
    get: {
        /**
         * @param {String} url
         * @return {Image}
         */
        image: function (url) {
            return cache.image[url];
        },
        /**
         * @param {String} url
         * @return {Audio}
         */
        audio: function (url) {
            return cache.audio[url];
        }
    },
    add: {
        /**
         * @param {String} url
         * @return {Image} HTML5 Image instance.
         */
        image: function (url) {
            count += 1;
            if (!(url in cache.image)) {
                cache.image[url] = Img(url, onload);
            }
            return cache.image[url];
        },
        /**
         * @param {String} url
         * @param {Object} conf
         * @return {Audio} HTML5 Audio instance.
         */
        audio: function (url, conf) {
            count += 1;
            if (!(url in cache.audio)) {
                cache.audio[url] = Audio(url, conf, onload);
            }
            return cache.audio[url];
        },
        /**
         * @param {String} family
         * @param {Object} conf
         * @return {Boolean} Always returns true.
         */
        font: function (family, conf) {
            count += 1;
            if (!(family in cache.font)) {
                cache.font[family] = Font(family, conf, onload);
            }
            return true;
        }
    }
};
