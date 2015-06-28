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
    get ready () {
        return count === 0;
    },
    get: {
        image: function (name) {
            return cache.image[name];
        },
        audio: function (name) {
            return cache.audio[name];
        }
    },
    add: {
        image: function (name, url) {
            count += 1;
            if (!(name in cache.image)) {
                cache.image[name] = Img(url, onload);
            }
            return cache.image[name];
        },
        audio: function (name, conf) {
            count += 1;
            if (!(name in cache.audio)) {
                cache.audio[name] = Audio(conf, onload);
            }
            return cache.audio[name];
        },
        font: function (name, conf) {
            count += 1;
            if (!(name in cache.font)) {
                cache.font[name] = Font(conf, onload);
            }
            return true;
        }
    }
};
