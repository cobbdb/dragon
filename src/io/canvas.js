var mobile = require('../util/detect-mobile.js'),
    canvas = document.createElement('canvas');

if (mobile) {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
} else {
    if (localStorage.drago === 'landscape') {
        canvas.width = 480;
        canvas.height = 320;
    } else {
        canvas.width = 320;
        canvas.height = 480;
    }
    canvas.style.border = '1px solid #000';
}

document.body.appendChild(canvas);
canvas.mobile = mobile;
canvas.ctx = canvas.getContext('2d');

global.Cocoon.Utils.setAntialias(false);
canvas.ctx.webkitImageSmoothingEnabled = false;
canvas.ctx.mozImageSmoothingEnabled = false;
canvas.ctx.imageSmoothingEnabled = false;

module.exports = canvas;
