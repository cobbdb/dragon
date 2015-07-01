var StartButton = require('./buttons/gameStart.js'),
    Point = require('./lib/Point.js'),
    Background = require('./static/introBackground.js');

module.exports = function IntroScreen() {
    return Screen({
        spriteSet: [
            StartButton({
                pos: Point(10, 20)
            }),
            Background()
        ]
    }).extend();
};
