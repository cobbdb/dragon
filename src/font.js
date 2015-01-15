/**
 * Cocoon only supports .tff fonts! oops
 */

var $ = require('curb'),
    tpl = "@font-face{font-family:'%s';font-style:%s;font-weight:%s;src:url(assets/fonts/%s.woff2) format('woff2');unicode-range:U+0000-00FF,U+0131,U+0152-0153,U+02C6,U+02DA,U+02DC,U+2000-206F,U+2074,U+20AC,U+2212,U+2215,U+E0FF,U+EFFD,U+F000}",
    cache = {};

module.exports = {
    /**
     * @param {String} opts.name
     * @param {String} [opts.style]
     * @param {String|Number} [opts.weight]
     * @param {String} opts.src
     */
    load: function (opts) {
        var style;

        if (!cache[opts.name]) {
            style = document.createElement('style');
            style.innerHTML = $(tpl,
                opts.name,
                opts.style || 'normal',
                opts.weight || '400',
                opts.src
            );
            document.body.appendChild(style);
            cache[opts.name] = true;
        }
    }
};
