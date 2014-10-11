module.exports = function (opts) {
    var width, height, pressEventName, ctx,
        canvas = document.createElement('canvas');

    if (window.innerWidth >= 500) {
        // Large screen devices.
        canvas.width = width = 320;
        canvas.height = height = 480;
        canvas.style.border = '1px solid #000';
        pressEventName = 'mousedown';
    } else {
        // Mobile devices.
        canvas.width = width = window.innerWidth;
        canvas.height = height = window.innerHeight;
        pressEventName = 'touchstart';
    }

    ctx = canvas.getContext('2d');

    return {
        states: {
            startup: 0,
            ready: 1
        },
        state: 0,
        start: function () {
            document.addEventListener(pressEventName, this.onpress);
            document.body.appendChild(canvas);
            this.state = this.states.ready;
        },
        run: function () {
        }
    };
};
