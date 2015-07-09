var timer = require('./timer.js'),
    hash,
    frameRate = frameCount = 0;

hash = timer.setInterval(function (over) {
    var time = 1000 + over;
    frameRate = global.Math.floor(frameCount * 1000 / time);
    frameCount = 0;
}, 1000);

module.exports = {
    countFrame: function () {
        frameCount += 1;
    },
    get frameRate () {
        return frameRate;
    },
    kill: function () {
        timer.clearInterval(hash);
    },
    draw: function (ctx) {
        ctx.resetTransform();
        ctx.globalAlpha = 0.5;
        ctx.font = '30px Verdana';
        ctx.fillStyle = '#f55';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(frameRate, 20, 20);
    }
};
