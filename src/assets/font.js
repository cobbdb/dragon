var Str = require('curb'),
    tpl = "@font-face{font-family:'%s';font-style:%s;font-weight:%s;src:url(%s);unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000}";

/**
 * @param {String} family
 * @param {String} opts.src
 * @param {String} [opts.style]
 * @param {String|Number} [opts.weight]
 * @param {Function} [onload]
 * @return {Boolean} Always returns true.
 */
module.exports = function (family, opts, onload) {
    var style = global.document.createElement('style');
    // Frontload - don't wait for draw to load the font.
    new Image().src = 'assets/font/' + opts.src;
    style.innerHTML = Str(tpl,
        family,
        opts.style || 'normal',
        opts.weight || '400',
        'assets/font/' + opts.src
    );
    style.onload = onload;
    global.document.body.appendChild(style);
    return true;
};
