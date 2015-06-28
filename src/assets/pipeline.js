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
     * Batch load assets.
     * @param {Map Of Strings} opts.image
     * @param {Map Of Objects} opts.audio
     * @param {Object|Array Of Objects} opts.font
     * @param {Function} done
     */
    load: function (opts, done) {
        var name,
            count = 0;

        Util.mergeDefaults(opts, {
            image: {},
            audio: {},
            font: []
        });
        done = done || function () {};
        opts.font = [].concat(opts.font);

        count += global.Object.keys(opts.image).length;
        count += global.Object.keys(opts.audio).length;
        count += opts.font.length;
        function onload() {
            count -= 1;
            if (count === 0) {
                done();
            }
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
        opts.font.forEach(function (conf) {
            if (!(conf.name in cache.font)) {
                cache.font[conf.name] = Font(conf, onload);
            }
        });
    }
};
