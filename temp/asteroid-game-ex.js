var Game = require('./lib/game.js'),
    Intro = require('./screens/intro.js'),
    Space = require('./screens/space.js'),
    Score = require('./screens/score.js'),
    Pause = require('./screens/pause.js');

/**
 * Each screen (and anything else) has access
 * to Game.canvas and Game.screenTap in its
 * definition.
 */
Game.addScreenSet([
    Intro(),
    Space(),
    Score(),
    Pause()
]);
Game.run();
