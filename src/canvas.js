var canvas = document.createElement('canvas'),
    ctx = canvas.getContext('2d'),
    mobile = false;

if (window.innerWidth >= 500) {
    // Large screen devices.
    canvas.width = 320;
    canvas.height = 480;
    canvas.style.border = '1px solid #000';
} else {
    // Mobile devices.
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    mobile = true;
}
document.body.appendChild(canvas);

module.exports = {
    isMobile: mobile,
    canvas: canvas,
    ctx: ctx
};
