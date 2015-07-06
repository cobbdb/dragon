module.exports = {
    Util: require('./object.js'),
    thing1: {
        name: 'bob',
        clone: function () {
            return 321;
        }
    },
    thing2: {
        age: 94,
        sub: {
            color: 'red',
            sub: {
                clone: function () {
                    return 456;
                }
            },
            sub2: {
                obj: {}
            },
            arr: [{
                clone: function () {
                    return 3838;
                }
            }]
        }
    }
};
