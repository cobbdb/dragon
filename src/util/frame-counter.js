var timeSinceLastSecond = frameCountThisSecond = frameRate = 0,
    timeLastFrame = global.Date.now();

module.exports = {
    countFrame: function () {
        var timeThisFrame = global.Date.now(),
            elapsedTime = timeThisFrame - timeLastFrame;

        frameCountThisSecond += 1;
        timeLastFrame = timeThisFrame;

        timeSinceLastSecond += elapsedTime;
        if (timeSinceLastSecond >= 1000) {
            timeSinceLastSecond -= 1000;
            frameRate = frameCountThisSecond;
            frameCountThisSecond = 0;
        }
    },
    get frameRate () {
        return frameRate;
    },
    draw: function (ctx) {
        ctx.globalAlpha = 0.5;
        ctx.font = '30px Verdana';
        ctx.fillStyle = '#f55';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'left';
        ctx.fillText(frameRate, 20, 50);
    }
};
