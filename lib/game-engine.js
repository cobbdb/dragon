var BaseClass = require('baseclassjs'),
    CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js');

module.exports = function (opts) {
    var pressEventName, ctx, tapCollisionSet,
        screen = Dimension(),
        canvas = document.createElement('canvas'),
        screenStack = opts.screenStack || [];

    if (window.innerWidth >= 500) {
        // Large screen devices.
        canvas.width = screen.width = 320;
        canvas.height = screen.height = 480;
        canvas.style.border = '1px solid #000';
        pressEventName = 'mousedown';
    } else {
        // Mobile devices.
        canvas.width = screen.width = window.innerWidth;
        canvas.height = screen.height = window.innerHeight;
        pressEventName = 'touchstart';
    }

    tapCollisionSet = CollisionHandler(
        Dimension(4, 4),
        screen
    );
    ctx = canvas.getContext('2d');
    document.addEventListener(pressEventName, function (event) {
        // Create a temporary click sprite in the 'screenTap'
        // collision set. This sprite gets removed at the end
        // of the update loop.
        // Use event.offsetX and event.offsetY for position.
        var tempthing = 'not sure what goes here yet';
        tapCollisionSet.update(tempthing);
    });
    document.body.appendChild(canvas);

    return BaseClass({
        state: 'READY',
        collisionSet: {
            screenTap: tapCollisionSet
        },
        screeSTack
        addCollisionSet: function (name, size) {
            this.collisionSet[name] = CollisionHandler(size, screen);
        },
        update: function () {
            var i;
            if (this.state === 'RUNNING') {
                for (i in this.collisionSet) {
                    this.collisionSet[i].handleCollisions();
                }
            }
        },
        draw: function () {
            screenStack.forEach(function (screen) {
                screen.draw(ctx);
            });
        },
        addScreen: function (screen) {
            
        },
        nextScreen: BaseClass.Stub
    });
};
