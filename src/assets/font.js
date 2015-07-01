var Str = require('curb');

// Create invisible <span> to force font prefetch.
function prefetch(family) {
    var span = global.document.createElement('span');
    span.style.fontFamily = family;
    span.style.display = 'none';
    global.document.body.appendChild(span);
}

/**
 * @param {String} family
 * @param {String} opts.src
 * @param {String} [opts.style]
 * @param {String|Number} [opts.weight]
 * @param {Function} [onload]
 * @return {Boolean} Always returns true.
 */
module.exports = function (family, opts, onload) {
    prefetch(family);
    var style = global.document.createElement('style');
    //new Image().src = 'assets/font/' + opts.src;
    style.innerHTML = Str('@font-face{%s}', [
        'font-family:' + family,
        'font-style:' + (opts.style || 'normal'),
        'font-weight:' + (opts.weight || 400),
        'src:url(assets/font/' + opts.src + ')'
    ].join(';'));
    global.document.body.appendChild(style);
    return true;
};
