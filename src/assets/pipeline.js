var Util = require('../util/object.js'),
    Img = require('./image.js'),
    Audio = require('./audio.js'),
    Font = require('./font.js'),
    Game = require('../game.js'),
    dir = require('../../assets/directory.json'),
    loaded = false,
    count = 0,
    onload = function () {
        count -= 1;
    },
    cache = {
        image: {},
        sound: {},
        font: {}
    };

module.exports = {
    /**
     * Ingest all images and sounds from the asset
     * directory listing - directory.json.
     */
    load: function () {
        if (!loaded) {
            loaded = true;
            dir.img.forEach(this.add.image);
            dir.sound.forEach(this.add.sound);
        }
    },
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
        sound: function (url) {
            return cache.sound[url];
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
         * @return {Audio} HTML5 Audio instance.
         */
        sound: function (url) {
            count += 1;
            if (!(url in cache.sound)) {
                cache.sound[url] = Audio(url, onload);
            }
            return cache.sound[url];
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
