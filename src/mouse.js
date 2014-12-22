var Point = require('./point.js'),
    Vector = require('./vector.js'),
    canvas = require('./canvas.js'),
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

canvas.addEventListener(
    startEventName,
    function (event) {
        isDown = true;
        current.x = event.offsetX;
        current.y = event.offsetY;
        global.setTimeout(function () {
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
    }
);
canvas.addEventListener(
    moveEventName,
    function (event) {
        last.x = current.x;
        last.y = current.y;
        current.x = event.offsetX;
        current.y = event.offsetY;

        if (isDown) {
            shift.start = current;
            shift.end = last;
            // Drag threshold.
            if (shift.size > 2) {
                isDragging = true;
            }
        }
    }
);

module.exports = {
    is: {
        get down () {
            return isDown;
        },
        get dragging () {
            return isDragging;
        },
        get holding () {
            return isHolding;
        }
    },
    get offset () {
        return current;
    },
    on: {
        down: function (cb) {
            canvas.addEventListener(startEventName, cb);
        },
        up: function (cb) {
            document.addEventListener(endEventName, cb);
        },
        move: function (cb) {
            canvas.addEventListener(moveEventName, cb);
        },
        drag: function (cb) {
            canvas.addEventListener(
                moveEventName,
                function (event) {
                    if (isDragging) {
                        cb(event);
                    }
                }
            );
        }
    },
    eventName: {
        start: startEventName,
        move: moveEventName,
        end: endEventName
    }
};
