var Game = require('./lib/game.js'),
    Intro = require('./screens/intro.js'),
    Space = require('./screens/space.js'),
    Score = require('./screens/score.js'),
    Pause = require('./screens/pause.js');

Game({
    screenSet: [
        Intro(), // --> screens need a canvas, from where?
        Space(),
        Score(),
        Pause()
    ]
});
