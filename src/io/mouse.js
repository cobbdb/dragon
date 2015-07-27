var BaseClass = require('baseclassjs'),
    Eventable = require('../interface/eventable.js'),
    Point = require('../geom/point.js'),
    Vector = require('../geom/vector.js'),
    canvas = require('./canvas.js'),
    mobile = require('../util/detect-mobile.js'),
    timer = require('../util/timer.js'),
    dragStart = null,
    is = {
        down: false,
        up: true,
        dragging: false,
        holding: false
    },
    current = Point(),
    last = Point(),
    shift = Vector(),
    startEventName = mobile ? 'touchstart' : 'mousedown',
    moveEventName = mobile ? 'touchmove' : 'mousemove',
    endEventName = mobile ? 'touchend' : 'mouseup';

/**
 * Update current Mouse offset.
 * @param {Mouse Event Object} event
 */
function updateCurrent(event) {
    if (mobile) {
        current.x = event.touches[0].clientX;
        current.y = event.touches[0].clientY;
    } else {
        current.x = event.offsetX;
        current.y = event.offsetY;
    }
}

// Click start event.
canvas.addEventListener(startEventName, function (event) {
    // Update state.
    is.down = is.holding = true;
    is.up = false;
    updateCurrent(event);

    // Trigger any callbacks.
    module.exports.trigger('$down', current);
});

// Click end event.
global.document.addEventListener(endEventName, function () {
    // Update state.
    is.down = is.dragging = is.holding = false;
    is.up = true;
    dragStart = null;

    // Trigger any callbacks.
    module.exports.trigger('$up', current);
});

// Move event.
canvas.addEventListener(moveEventName, function (event) {
    last.x = current.x;
    last.y = current.y;
    updateCurrent(event);

    if (is.down) {
        // Update state.
        is.holding = false;

        // Check for start of dragging event.
        if (!is.dragging) {
            shift.x = current.x - last.x;
            shift.y = current.y - last.y;

            // Drag threshold.
            if (shift.D() > 1) {
                is.dragging = true;
                dragStart = current;
            }
        }

        // Trigger drag callbacks.
        if (is.dragging) {
            module.exports.trigger('$drag', current);
        }
    }
});

/**
 * @class Mouse
 * @extends BaseClass
 * @implements Eventable
 */
module.exports = BaseClass({ // <-- Replace with just Eventable()
    is: is,
    /**
     * @type {Point}
     */
    offset: current,
    dragStart: dragStart,
    eventName: {
        start: startEventName,
        move: moveEventName,
        end: endEventName
    }
}).implement(
    Eventable()
);
