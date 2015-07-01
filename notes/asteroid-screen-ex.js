var Ship = require('./game/ship.js'),
    ScoreBoard = require('./ui/scoreboard.js'),
    Asteroid = require('./game/asteroid.js'),
    Background = require('./game/background.js'),
    Key = require('./util/keyboard.js');

module.exports = function () {
    return Screen({
        spriteSet: [
            Ship(),
            ScoreBoard(),
            Background()
        ]
    }).extend({
        update: function () {
            // Create some new asteroids on space bar.
            if (Key('Space').isDown) {
                this.addSpriteSet([
                    Astroid(),
                    Astroid(),
                    Astroid()
                ]);
            }
            this.base.update();
        }
    });
};
