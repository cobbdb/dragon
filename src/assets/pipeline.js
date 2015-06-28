var Util = require('../util/object.js'),
    Img = require('./image.js'),
    Audio = require('./audio.js'),
    Font = require('./font.js'),
    cache = {
        image: {},
        audio: {},
        font: {}
    };

module.exports = {
    get: {
        image: function (name) {
            return cache.image[name];
        },
        audio: function (name) {
            return cache.audio[name];
        }
    },
    /**
     * @param {Function} opts.done
     * @param {Map Of Strings} opts.image
     * @param {Map Of Strings} opts.audio
     * @param {Map Of Objects} opts.font
     */
    load: function (opts) {
        var name, conf;

        Util.mergeDefaults(opts, {
            done: function () {},
            image: {},
            audio: {},
            font: {}
        });

        function onload() {
            opts.done();
        }

        for (name in opts.image) {
            if (!(name in cache.image)) {
                cache.image[name] = Img(
                    opts.image[name],
                    onload
                );
            }
        }
        for (name in opts.audio) {
            if (!(name in cache.audio)) {
                cache.audio[name] = Audio(
                    opts.audio[name],
                    onload
                );
            }
        }
        for (name in opts.font) {
            if (!(name in cache.font)) {
                cache.font[name] = Font(
                    opts.font[name],
                    onload
                );
            }
        }
    }
};
