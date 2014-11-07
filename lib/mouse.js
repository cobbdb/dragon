var Game = require('./game.js'),
    isDown = false;

document.addEventListener(
    Game.pressEventName.start,
    function (event) {
        isDown = true;
    }
);
document.addEventListener(
    Game.pressEventName.end,
    function (event) {
        isDown = false;
    }
);

/**
 * @example
 * Mouse.isDown
 */
module.exports = {
    get isDown () {
        return isDown;
    }
};
