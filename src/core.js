var Game = require('./game.js'),
    Util = require('./util.js');

module.exports = {
    Shape: require('./shape.js'),
    Circle: require('./circle.js'),
    Rectangle: require('./rectangle.js'),

    Dimension: require('./dimension.js'),
    Point: require('./point.js'),
    Vector: require('./vector.js'),
    Polar: require('./polar.js'),

    FrameCounter: require('./frame-counter.js'),
    IdCounter: require('./id-counter.js'),
    random: require('./random.js'),
    range: Util.range,
    shuffle: Util.shuffle,
    mergeLeft: Util.mergeLeft,
    mergeDefault: Util.mergeDefault,
    Mouse: require('./mouse.js'),
    Keyboard: require('./keyboard.js'),

    EventHandler: require('./event-handler.js'),
    SpriteSheet: require('./spritesheet.js'),
    AnimationStrip: require('./animation-strip.js'),
    Audio: require('./audio.js'),
    Font: require('./font.js'),

    CollisionHandler: require('./collision-handler.js'),
    collisions: require('./dragon-collisions.js'),

    screen: Game.screen,
    addScreens: Game.addScreens,
    removeScreen: Game.removeScreen,
    run: Game.run.bind(Game),
    kill: Game.kill,

    canvas: require('./canvas.js'),
    Screen: require('./screen.js'),
    Collidable: require('./collidable.js'),
    Sprite: require('./sprite.js'),
    ClearSprite: require('./clear-sprite.js'),

    ui: {
        Slider: require('./ui/slider.js'),
        Button: require('./ui/button.js'),
        Label: require('./ui/label.js'),
        Decal: require('./ui/decal.js')
    }
};
