var Game = require('./game.js'),
    count = 0;

/**
 * @param opts.src
 */
module.exports = function (opts) {
    var img = new Image();
    count += 1;
    img.onload = function () {
        count -= 1;
        if (count === 0) {
            // All images have be loaded, so..
            // .. now what?
            Game.run(); // <-- this isn't quite right.
        }
    });
    img.src = 'assets/img/' + opts.src;
    return img;
};
