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
canvas.mobile = mobile;
canvas.ctx = canvas.getContext('2d');
canvas.mask = Rectangle(
    Point(0, 0),
    Dimension(canvas.width, canvas.height)
);

global.Cocoon.Utils.setAntialias(false);
canvas.ctx.webkitImageSmoothingEnabled = false;
canvas.ctx.mozImageSmoothingEnabled = false;
canvas.ctx.imageSmoothingEnabled = false;

module.exports = canvas;
