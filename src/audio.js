/**
 * @param {String} opts.src
 * @param {Boolean} [opts.loop] Defaults to false.
 * @param {Number} [opts.volume] Defaults to 1. Volume
 * level between 0 and 1.
 * @param {Function} [opts.on.load]
 * @param {Function} [opts.on.play]
 * @param {Function} [opts.on.playing]
 * @param {Function} [opts.on.ended]
 * @return {Audio}
 */
module.exports = function (opts) {
    var audio = document.createElement('audio');
    audio.ready = false;
    audio.loop = opts.loop || false;
    audio.volume = opts.volume || 1;

    opts.on = opts.on || {};
    opts.on.load = opts.on.load || function () {};
    audio.onloadeddata = function () {
        this.ready = true;
        opts.on.load();
    };
    audio.onplay = opts.on.play;
    audio.onplaying = opts.on.playing;
    audio.onended = opts.on.ended;

    audio.src = opts.src;
    return audio;
};
