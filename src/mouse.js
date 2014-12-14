var Point = require('./point.js'),
    Vector = require('./vector.js'),
    isDown = false,
    isDragging = false,
    current = Point(),
    last = Point(),
    shift = Vector(),
    startEventName,
    moveEventName,
    endEventName;

if (window.innerWidth >= 500) {
    startEventName = 'mousedown';
    moveEventName = 'mousemove';
    endEventName = 'mouseup';
} else {
    startEventName = 'touchstart';
    moveEventName = 'touchmove';
    endEventName = 'touchend';
}

document.addEventListener(
    startEventName,
    function (event) {
        isDown = true;
        current.x = event.offsetX;
        current.y = event.offsetY;
    }
);
document.addEventListener(
    endEventName,
    function (event) {
        isDown = isDragging = false;
    }
);
document.addEventListener(
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
        }
    },
    get offset () {
        return current;
    },
    on: {
        down: function (cb) {
            document.addEventListener(startEventName, cb);
        },
        up: function (cb) {
            document.addEventListener(endEventName, cb);
        },
        move: function (cb) {
            document.addEventListener(moveEventName, cb);
        },
        drag: function (cb) {
            document.addEventListener(
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
