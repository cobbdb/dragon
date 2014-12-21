module.exports = function (src) {
    var img = new Image();
    img.ready = false;
    img.cmd = [];

    img.processLoadEvents = function () {
        this.cmd.forEach(function (cb) {
            cb(img);
        });
        this.cmd = [];
    };

    img.onload = function () {
        this.ready = true;
        this.processLoadEvents();
    };

    img.load = function (cb) {
        this.cmd.push(
            cb || function () {}
        );
        if (this.ready) {
            this.processLoadEvents();
        } else {
            this.src = 'assets/img/' + src;
        }
    };

    return img;
};
