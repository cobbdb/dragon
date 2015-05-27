var BaseClass = require('baseclassjs'),
    Eventable = require('./event-handler.js');

module.exports = function () {
    return BaseClass({
        name: 'dragon-item',
        depth: 0,
        updating: true,
        drawing: true,
        update: BaseClass.Abstract,
        draw: BaseClass.Abstract,
        teardown: BaseClass.Abstract
    }).implement(
        Eventable()
    );
};
