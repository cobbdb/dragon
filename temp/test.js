var BC = require('baseclassjs');
function checkit(thing) {
    console.log(thing.name);
}
parent = {
    extend: BC,
    update: function () {
        checkit(this);
    }
};

child = parent.extend({
    name: 'child',
    update: function () {
        this.base.update();
        checkit(this);
    }
});

child.update();
