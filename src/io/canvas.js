var Rectangle = require('../geom/rectangle.js'),
    Point = require('../geom/point.js'),
    Dimension = require('../geom/dimension.js'),
    mobile = require('../util/detect-mobile.js'),
    canvas = global.document.createElement('canvas');

if (mobile) {
    canvas.width = global.innerWidth;
    canvas.height = global.innerHeight;
} else {
    if (global.localStorage.drago === 'landscape') {
        canvas.width = 480;
        canvas.height = 320;
    } else {
        canvas.width = 320;
        canvas.height = 480;
    }
    canvas.style.border = '1px solid #000';
}

global.document.body.appendChild(canvas);

/**
 * @type {Boolean}
 */
canvas.mobile = mobile;

/**
 * @type {Graphics2D}
 */
canvas.ctx = canvas.getContext('2d');

// Polyfill resetTransform for Cocoonjs.
if (!canvas.ctx.resetTransform) {
    canvas.ctx.resetTransform = function () {
        canvas.ctx.setTransform(1, 0, 0, 1, 0, 0);
    };
}

/**
 * Clear the canvas.
 */
canvas.clear = function () {
    canvas.ctx.clearRect(
        0, 0,
        canvas.width,
        canvas.height
    );
};

/**
 * @type {Rectangle}
 */
canvas.mask = Rectangle(
    Point(0, 0),
    Dimension(canvas.width, canvas.height)
);

/**
 * @type {Point}
 */
canvas.center = Point(
    canvas.width / 2,
    canvas.height / 2
);

global.Cocoon.Utils.setAntialias(false);
canvas.ctx.imageSmoothingEnabled = false;

module.exports = canvas;
