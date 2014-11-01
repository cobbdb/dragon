var BaseClass = require('baseclassjs'),
    CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js');

module.exports = function (opts) {
    var pressEventName, ctx, tapCollisionSet,
        canvas = document.createElement('canvas'),
        screenStack = opts.screenStack || [];

    if (window.innerWidth >= 500) {
        // Large screen devices.
        canvas.width = 320;
        canvas.height = 480;
        canvas.style.border = '1px solid #000';
        pressEventName = 'mousedown';
    } else {
        // Mobile devices.
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        pressEventName = 'touchstart';
    }

    tapCollisionSet = CollisionHandler(
        Dimension(4, 4),
        canvas
    );
    ctx = canvas.getContext('2d');
    document.addEventListener(pressEventName, function (event) {
        tapCollisionSet.update(Collidable({
            name: 'screentap',
            mask: Circle(
                event.offsetX,
                event.offsetY,
                12
            )
        }));
    });
    document.body.appendChild(canvas);

    return BaseClass({
        collisionSet: {
            screenTap: tapCollisionSet
        },
        screenStack: [],
        addCollisionSet: function (name, size) {
            this.collisionSet[name] = CollisionHandler(size, canvas);
        },
        update: function () {
            var i;
            screenStack.forEach(function (screen) {
                screen.update();
            });
            for (i in this.collisionSet) {
                this.collisionSet[i].handleCollisions();
            }
        },
        draw: function () {
            screenStack.forEach(function (screen) {
                screen.draw(ctx);
            });
        },
        addScreen: function (screen) {
            
        }
    });
};
