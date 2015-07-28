/**
 * @class Audio
 * @extends HTML5 Audio
 * @param {String} url
 * @param {Function} [onload]
 */
module.exports = function (url, onload) {
    var audio = global.document.createElement('audio'),
        oldplay = audio.play;
    audio.onloadeddata = onload;

    /**
     * @type {Boolean} loop Defaults to false.
     */
    audio.loop = false;
    /**
     * @type {Number} volume Defaults to 1. Volume
     * level between 0 and 1.
     */
    audio.volume = 1;

    /**
     * @param {Boolean} [force] Defaults to false. Force
     * immediate play from the start, even if the audio
     * is already playing.
     */
    audio.play = function (force) {
        if (force) {
            this.currentTime = 0;
        }
        oldplay.call(this);
    };
    /**
     * Pause playback and reset time index.
     */
    audio.stop = function () {
        this.pause();
        this.currentTime = 0;
    };

    /**
     * @type {Function} onplay Called each time play begins.
     */
    audio.onplay = function () {};
    /**
     * @type {Function} onplaying Called continuously
     * when playing.
     */
    audio.onplaying = function () {};
    /**
     * @type {Function} onended Called when play ends.
     */
    audio.onended = function () {};

    audio.src = 'assets/sound/' + url;
    return audio;
};
