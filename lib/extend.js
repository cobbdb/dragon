var BaseClass = function (child) {
    var key;
    child.base = this;
    for (key in this) {
        child[key] = child[key] || this[key];
    }
    return child;
};

var Animal = function (name) {
    return {
        name: name,
        weight: '100lbs',
        speak: function () {
            console.log('parent is speaking.');
        },
        extend: BaseClass
    };
};
var Dog = function (name) {
    var parent = Animal(name);
    return parent.extend({
        speak: function () {
            console.log("I'm a dog and I weight " + this.base.weight);
        }
    });
};
var Nelly = function () {
    var parent = Dog('Nelly');
    return parent.extend({
        speak: function () {
            console.log('My name is Nelly');
            this.base.speak();
            this.base.base.speak();
        }
    });
};
