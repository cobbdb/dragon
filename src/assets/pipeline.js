var Util = require('../util/object.js'),
    Img = require('./image.js'),
    Audio = require('./audio.js'),
    Font = require('./font.js'),
    Game = require('../game.js'),
    heartbeat = require('../heartbeat.js'),
    dir = require('../../../../assets/directory.json'),
    loaded = false,
    /**
     * Count of assets currently loading.
     * @type {Number}
     */
    count = 0,
    /**
     * Called when all assets have finished loading.
     * @type {Function}
     */
    oncomplete = function () {},
    /**
     * Called each time a single assets finishes loading.
     * @type {Function}
     */
    onload = function () {
        count -= 1;
        if (count === 0) {
            oncomplete();
        }
    },
    /**
     * Cache of all loaded assets.
     * @type {Map Of Map}
     */
    cache = {
        image: {},
        sound: {},
        font: {}
    };

module.exports = {
    /**
     * Ingest all images and sounds from the asset
     * directory listing - directory.json.
     * @param {Function} [done] Callback for when assets
     * are done loading.
     */
    load: function (done) {
        done = done || function () {};
        if (!loaded) {
            loaded = true;
            oncomplete = function () {
                done();
                heartbeat.run();
            };
            count += dir.img.length;
            count += dir.sound.length;
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
            if (!(family in cache.font)) {
                cache.font[family] = Font(family, conf);
            }
            return true;
        }
    }
};
