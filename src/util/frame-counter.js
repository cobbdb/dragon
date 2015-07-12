var timer = require('./timer.js'),
    hash,
    started = false,
    frameRate = frameCount = 0,
    mean = meantot = meancnt = 0,
    meanset = [];

function step(over) {
    var time = 1000 + over;

    // Calculate frame rate.
    frameRate = global.Math.floor(frameCount / time * 1000);
    frameCount = 0;

    // Update mean.
    meancnt += 1;
    meanset.push(frameRate);
    if (meanset.length > 10) {
        meanset.shift();
        meancnt = 10;
    }
    meantot = meanset.reduce(function (a, b) {
        return a + b;
    });
    mean = (meantot / meancnt).toFixed(1);
}

module.exports = {
    countFrame: function () {
        frameCount += 1;
    },
    get frameRate () {
        return frameRate;
    },
    kill: function () {
        if (started) {
            timer.clear(hash);
        }
    },
    draw: function (ctx) {
        ctx.resetTransform();
        ctx.globalAlpha = 0.5;
        ctx.font = '30px Verdana';
        ctx.fillStyle = '#f55';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(
            frameRate + '/' + mean,
            20, 20
        );
    },
    start: function () {
        if (!started) {
            hash = timer.setInterval(step, 1000);
        }
    }
};
