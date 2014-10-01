var Game = {
    states: {
        startup: 0,
        ready: 1
    },
    state: 0,
    noop: function () {},
    init: function (custom) {
        this.canvas = document.createElement('canvas');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.pressEventName = 'touchstart';
        if (this.width >= 500) {
            this.width = 320;
            this.height = 480;
            this.canvas.style.border = '1px solid #000';
            this.pressEventName = 'mousedown';
        }
        if (!this.canvas.getContext) {
            alert('This browser does not support HTML5!');
            throw Error('This browser does not support HTML5!');
        }
        this.onpress = this.onpress || this.noop;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.ctx = this.canvas.getContext('2d');
        custom(this);
    },
    start: function (custom) {
        document.addEventListener(this.pressEventName, this.onpress);
        document.body.appendChild(this.canvas);
        custom(this);
        this.state = this.states.ready;
    },
    run: function () {
    }
};
