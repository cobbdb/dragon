var Game = require('./game.js'),
    SetUtil = require('./util/set.js'),
    ObjUtil = require('./util/object.js'),
    heartbeat = require('./heartbeat.js'),
    pipeline = require('./assets/pipeline.js');

module.exports = {
    // Geometry
    Shape: require('./geom/shape.js'),
    Circle: require('./geom/circle.js'),
    Rectangle: require('./geom/rectangle.js'),
    Dimension: require('./geom/dimension.js'),
    Point: require('./geom/point.js'),
    Vector: require('./geom/vector.js'),
    Polar: require('./geom/polar.js'),

    // Utility
    FrameCounter: require('./util/frame-counter.js'),
    IdCounter: require('./util/id-counter.js'),
    random: require('./util/random.js'),
    range: SetUtil.range,
    shuffle: SetUtil.shuffle,
    mergeLeft: ObjUtil.mergeLeft,
    mergeDefaults: ObjUtil.mergeDefaults,

    // I/O
    Mouse: require('./io/mouse.js'),
    Key: require('./io/keyboard.js'),
    canvas: require('./io/canvas.js'),

    // Assets
    addFont: pipeline.add.font,
    image: pipeline.get.image,
    sound: pipeline.get.audio,
    AnimationStrip: require('./animation-strip.js'),

    // Collisions
    CollisionHandler: require('./collision-handler.js'),
    collisions: require('./dragon-collisions.js'),

    // Game Control
    start: heartbeat.start,
    screen: Game.screen,
    sprite: Game.sprite,
    addScreens: Game.addScreens,
    removeScreen: Game.removeScreen,

    // Core Components
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
