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
         * @param {String} name
         * @return {Image}
         */
        image: function (name) {
            return cache.image[name];
        },
        /**
         * @param {String} name
         * @return {Audio}
         */
        audio: function (name) {
            return cache.audio[name];
        }
    },
    add: {
        /**
         * @param {String} name
         * @param {String} url
         * @return {Image} HTML5 Image instance.
         */
        image: function (name, url) {
            count += 1;
            if (!(name in cache.image)) {
                cache.image[name] = Img(url, onload);
            }
            return cache.image[name];
        },
        /**
         * @param {String} name
         * @param {Object} conf
         * @return {Audio} HTML5 Audio instance.
         */
        audio: function (name, conf) {
            count += 1;
            if (!(name in cache.audio)) {
                cache.audio[name] = Audio(conf, onload);
            }
            return cache.audio[name];
        },
        /**
         * @param {String} name
         * @param {Object} conf
         * @return {Boolean} Always returns true.
         */
        font: function (name, conf) {
            count += 1;
            if (!(name in cache.font)) {
                cache.font[name] = Font(conf, onload);
            }
            return true;
        }
    }
};
