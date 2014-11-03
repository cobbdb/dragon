var BaseClass = require('baseclassjs'),
    CollisionHandler = require('./collision-handler.js'),
    Dimension = require('./dimension.js'),
    Circle = require('./circle.js'),
    Collidable = require('./collidable.js');

module.exports = function (opts) {
    var pressEventName, ctx, tapCollisionSet,
        canvas = document.createElement('canvas'),
        screens = opts.screenSet || {},
        screensToAdd = [],
        screenRemoved = false;

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
        addCollisionSet: function (name, size) {
            this.collisionSet[name] = CollisionHandler(size, canvas);
        },
        screen: function (name) {
            return screens[name];
        },
        addScreen: function (screen) {
            screensToAdd.push(screen);
        },
        addScreenSet: function (set) {
            screensToAdd = screensToAdd.concat(set);
        },
        removeScreen: function (screen) {
            screen.removed = true;
            screenRemoved = true;
        },
        update: function () {
            var i;
            screenStack.forEach(function (screen) {
                screen.update();
            });
            for (i in this.collisionSet) {
                this.collisionSet[i].handleCollisions();
                this.collisionSet[i].clearCollisions();
            }

            if (screensToAdd.length) {
                // Update the master screen list after updates.
                screens = _.union(screens, screensToAdd);
                // Sort by descending sprite depths.
                screens.sort(function (a, b) {
                    return b.depth - a.depth;
                });
                screensToAdd = [];
            }
            if (screenRemoved) {
                // Remove any stale screens.
                screens = screens.filter(function (screen) {
                    // true to keep, false to drop.
                    return !screen.removed;
                });
                screenRemoved = false;
            }
        },
        draw: function () {
            screenStack.forEach(function (screen) {
                screen.draw(ctx);
            });
        }
    });
};
