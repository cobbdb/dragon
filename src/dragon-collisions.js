var CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js');

module.exports = CollisionHandler({
    name: 'dragon',
    gridSize: Dimension(4, 4)
});
