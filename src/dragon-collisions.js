var CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js'),
    canvas = require('./canvas.js');

module.exports = CollisionHandler({
    name: 'dragon',
    gridSize: Dimension(4, 4),
    canvasSize: canvas
});
