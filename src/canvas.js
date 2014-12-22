var canvas = document.createElement('canvas');

if (window.innerWidth >= 500) {
    // Large screen devices.
    canvas.width = 320;
    canvas.height = 480;
    canvas.style.border = '1px solid #000';
    canvas.mobile = false;
} else {
    // Mobile devices.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    document.body.style.height = canvas.height + 'px';
    canvas.mobile = true;
}
document.body.appendChild(canvas);

canvas.ctx = canvas.getContext('2d');
module.exports = canvas;
