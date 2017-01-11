function Keyboard(sendMessage) {
	var _self = this;
	_self.up = false;
	_self.left = false;
	_self.right = false;
	_self.down = false;
	_self.onKeyUp = onKeyUp;
	_self.onKeyDown = onKeyDown;
	_self.clearPressedKeys = clearPressedKeys;
	_self.sendMessage = sendMessage;

	function clearPressedKeys() {
		console.log("clearPressedKeys");
		_self.up = false;
		_self.left = false;
		_self.right = false;
		_self.down = false;
	}

	function onKeyDown(e) {
		var c = e.keyCode;
		switch (c) {
			case 37: // Left
				_self.left = true;
				break;
			case 38: // Up
				_self.up = true;
				break;
			case 39: // Right
				_self.right = true;
				break;
			case 40: // Down
				_self.down = true;
				break;
			case 13:
				_self.sendMessage();
				break;
		};
	}

	function onKeyUp(e) {
		var c = e.keyCode;
		switch (c) {
			case 37: // Left
				_self.left = false;
				break;
			case 38: // Up
				_self.up = false;
				break;
			case 39: // Right
				_self.right = false;
				break;
			case 40: // Down
				_self.down = false;
				break;
		};
	}

	return _self;
};