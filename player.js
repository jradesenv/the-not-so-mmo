var uuid = require('node-uuid'),
    util = require("util");

module.exports = function (id, name, startX, startY) {
    var _x = null, _y = null;

    //definition    
    var _self = this;
    _self.getX = getX;
    _self.getY = getY;
    _self.setX = setX;
    _self.setY = setY;
    _self.id = id;
    _self.name = name;

    function init() {
        _x = startX;
        _y = startY;
    }
    init();

    //implementation
    function getX () {
        return _x;
    }

    function getY () {
        return _y;
    }

    function setX (newX) {
        _x = newX;
    }

    function setY (newY) {
        _y = newY;
    }

    return _self;
};