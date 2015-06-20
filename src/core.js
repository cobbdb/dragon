var Game = require('./game.js'),
    SetUtil = require('./util/set.js'),
    ObjUtil = require('./util/object.js');

module.exports = {
    // Classes
    Shape: require('./geom/shape.js'),
    Circle: require('./geom/circle.js'),
    Rectangle: require('./geom/rectangle.js'),
    Dimension: require('./geom/dimension.js'),
    Point: require('./geom/point.js'),
    Vector: require('./geom/vector.js'),
    Polar: require('./geom/polar.js'),

    FrameCounter: require('./util/frame-counter.js'),
    IdCounter: require('./util/id-counter.js'),
    random: require('./util/random.js'),
    range: SetUtil.range,
    shuffle: SetUtil.shuffle,
    mergeLeft: ObjUtil.mergeLeft,
    mergeDefault: ObjUtil.mergeDefault,

    // I/O
    Mouse: require('./io/mouse.js'),
    Key: require('./io/keyboard.js'),
    Audio: require('./io/audio.js'),
    Font: require('./io/font.js'),
    canvas: require('./io/canvas.js'),

    SpriteSheet: require('./spritesheet.js'),
    AnimationStrip: require('./animation-strip.js'),

    CollisionHandler: require('./collision-handler.js'),
    collisions: require('./dragon-collisions.js'),

    screen: Game.screen,
    sprite: Game.sprite,
    addScreens: Game.addScreens,
    removeScreen: Game.removeScreen,
    run: Game.run.bind(Game),
    kill: Game.kill,

    Screen: require('./screen.js'),
    CollisionItem: require('./collision-item.js'),
    Sprite: require('./sprite.js'),
    ClearSprite: require('./clear-sprite.js'),

    // UI Builtins
    ui: {
        Slider: require('./ui/slider.js'),
        Button: require('./ui/button.js'),
        Label: require('./ui/label.js'),
        Decal: require('./ui/decal.js')
    },

    // Interfaces
    fadeable: require('./interface/fadeable.js'),
    Eventable: require('./interface/eventable.js')
};
