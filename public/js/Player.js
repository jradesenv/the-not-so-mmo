function Player(id, name, startX, startY, height, width) {

	//definition    
	var _self = this;
	_self.id = id;
	_self.name = name;
	_self.height = height;
	_self.width = width;
	_self.getX = getX;
	_self.getY = getY;
	_self.setX = setX;
	_self.setY = setY;
	_self.update = update;
	_self.draw = draw;
	_self.speed = 10;
	_self._x = startX;
	_self._y = startY;

	//implementation
	function getX() {
		return _self._x;
	}

	function getY() {
		return _self._y;
	}

	function setX(newX) {
		_self._x = newX;
	}

	function setY(newY) {
		_self._y = newY;
	}

	function update(keyboard) {
		var prevX = _self._x,
			prevY = _self._y;

		if (keyboard.up) {
			_self._y -= _self.speed;
		} else if (keyboard.down) {
			_self._y += _self.speed;
		};

		if (keyboard.left) {
			_self._x -= _self.speed;
		} else if (keyboard.right) {
			_self._x += _self.speed;
		};

		return (prevX != _self._x || prevY != _self._y) ? true : false;
	}

	function draw(ctx) {
		if (_self.name) {
			ctx.fillStyle = "#ff0000";
			ctx.fillText(_self.name, _self._x - (_self.height / 2), _self._y - (_self.width / 2));
		}
	}

	return _self;
}