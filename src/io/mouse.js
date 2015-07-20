var Point = require('../geom/point.js'),
    Vector = require('../geom/vector.js'),
    canvas = require('./canvas.js'),
    timer = require('../util/timer.js'),
    dragStart = null,
    isDown = false,
    isDragging = false,
    isHolding = false,
    current = Point(),
    last = Point(),
    shift = Vector(),
    startEventName,
    moveEventName,
    endEventName;

if (canvas.mobile) {
    startEventName = 'touchstart';
    moveEventName = 'touchmove';
    endEventName = 'touchend';
} else {
    startEventName = 'mousedown';
    moveEventName = 'mousemove';
    endEventName = 'mouseup';
}

/**
 * @return {Point}
 */
function getOffset(event) {
    if (canvas.mobile) {
        return Point(
            event.touches[0].clientX,
            event.touches[0].clientY
        );
    }
    return Point(
        event.offsetX,
        event.offsetY
    );
}

canvas.addEventListener(
    startEventName,
    function (event) {
        isDown = true;
        current = getOffset(event);
        timer.setTimeout(function () {
            if (isDown) {
                isHolding = true;
            }
        }, 200);
    }
);
document.addEventListener(
    endEventName,
    function (event) {
        isDown = isDragging = isHolding = false;
        dragStart = null;
    }
);
canvas.addEventListener(
    moveEventName,
    function (event) {
        last = current;
        current = getOffset(event);

        if (isDown && !isDragging) {
            shift.x = current.x - last.x;
            shift.y = current.y - last.y;
            // Drag threshold.
            if (shift.magnitude > 1) {
                isDragging = true;
                dragStart = current;
            }
        }
    }
);

module.exports = {
    is: {
        get down () {
            return isDown;
        },
        get up () {
            return !isDown;
        },
        get dragging () {
            return isDragging;
        },
        get holding () {
            return isHolding;
        }
    },
    /**
     * @return {Point}
     */
    get offset () {
        return current;
    },
    get dragStart () {
        return dragStart;
    },
    on: {
        down: function (cb, thisArg) {
            canvas.addEventListener(
                startEventName,
                cb.bind(thisArg)
            );
        },
        click: function (cb, thisArg) {},
        dclick: function (cb, thisArg) {},
        up: function (cb, thisArg) {
            document.addEventListener(
                endEventName,
                cb.bind(thisArg)
            );
        },
        move: function (cb, thisArg) {
            canvas.addEventListener(
                moveEventName,
                cb.bind(thisArg)
            );
        },
        drag: function (cb, thisArg) {
            canvas.addEventListener(moveEventName, function () {
                if (isDragging) {
                    cb.call(thisArg);
                }
            });
        },
        /**
         * @param {String} dir Swipe direction.
         * @param {Function cb
         * @param {Any} thisArg
         */
        swipe: function (dir, cb, thisArg) {}
    },
    eventName: {
        start: startEventName,
        move: moveEventName,
        end: endEventName
    }
};
