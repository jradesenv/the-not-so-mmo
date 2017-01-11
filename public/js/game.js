(function () {

	var canvas,
		ctx,
		keyboard,
		localPlayer,
		remotePlayers,
		socket,
		scrollMessages,
		ulMessages,
		txtMessage,
		isWindowFocused,
		pageTitleText,
		serverUrl = "https://the-not-so-mmo.herokuapp.com";
		//serverUrl = "http://localhost:3000";

	init();

	function init() {
		canvas = document.getElementById("gameCanvas");
		scrollMessages = document.getElementById("scrollMessages");
		ulMessages = document.getElementById("ulMessages");
		txtMessage = document.getElementById("txtMessage");
		isWindowFocused = true;
		pageTitleText = "The Not So MMO GAME";
		document.title = pageTitleText
		
		ctx = canvas.getContext("2d");

		onResize();

		keyboard = new Keyboard(sendMessage);

		var startX = 100,
			startY = 100;

		var playerName = prompt("What's your name?");

		localPlayer = new Player(null, playerName, startX, startY, 50, 50);
		remotePlayers = [];

		setTimeout(function () {
			socket = io.connect(serverUrl);

			setEventHandlers();
			animate();
		}, 1000);
	};

	function setEventHandlers() {
		window.addEventListener("keydown", onKeydown, false);
		window.addEventListener("keyup", onKeyup, false);
		window.addEventListener("resize", onResize, false);
		window.addEventListener("blur", onWindowBlur, false);
		window.addEventListener("focus", onWindowFocus, false);

		socket.on("connect", onSocketConnected);
		socket.on("disconnect", onSocketDisconnect);
		socket.on("new-player", onNewPlayer);
		socket.on("move-player", onMovePlayer);
		socket.on("remove-player", onRemovePlayer);
		socket.on("new-message", onNewMessage);
	};

	function onKeydown(e) {
		if (localPlayer) {
			keyboard.onKeyDown(e);
		};
	};

	function onKeyup(e) {
		if (localPlayer) {
			setTimeout(function() {//delay pra nao conflitar com keydown
				keyboard.onKeyUp(e);
			}, 10);
		};
	};



	function onWindowBlur(e) {
		isWindowFocused = false;
		//evita que o player ande infinitamente se o browser perder o foco com uma tecla clicada
		keyboard.clearPressedKeys();
	}

	function onWindowFocus(e) {
		isWindowFocused = true;
		document.title = pageTitleText;
	}

	function onResize() {
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}

	function onSocketConnected() {
		console.log("Connected to server");
		socket.emit("new-player", { name: localPlayer.name, x: localPlayer.getX(), y: localPlayer.getY() });
	}

	function onSocketDisconnect() {
		console.log("Disconnected from server");
	}

	function sendMessage() {
		var msgData = { name: localPlayer.name, msg: txtMessage.value };
		socket.emit("new-message", msgData);

		txtMessage.value = "";
		onNewMessage(msgData);
	}

	function onNewMessage(data) {
		var msg = "<b>[ " + data.name + " ] diz: </b>" + data.msg;
		if(data.adm) {
			msg = "<font color='red'>" + msg + "</font>";
		}

		var li = document.createElement("li");
		li.innerHTML = msg;
		ulMessages.appendChild(li);
		
		scrollToLastMessages();

		if(!isWindowFocused) {
			document.title = "* " + pageTitleText;
		}
	}

	function scrollToLastMessages() {
		scrollMessages.scrollTop = scrollMessages.scrollHeight;
	}

	function onNewPlayer(data) {
		console.log("New player connected: " + data.id);
		var newPlayer = new Player(data.id, data.name, data.x, data.y, 50, 50);
		remotePlayers.push(newPlayer);
	}

	function onMovePlayer(data) {
		var movePlayer = playerById(data.id);

		if (!movePlayer) {
			return;
		};

		movePlayer.setX(data.x);
		movePlayer.setY(data.y);
	}

	function onRemovePlayer(data) {
		var removePlayer = playerById(data.id);

		if (!removePlayer) {
			return;
		};

		remotePlayers.splice(remotePlayers.indexOf(removePlayer), 1);
	}

	function animate() {
		update();
		draw();

		window.requestAnimFrame(animate);
	}

	function update() {
		if (localPlayer.update(keyboard)) {
			socket.emit("move-player", { x: localPlayer.getX(), y: localPlayer.getY() });
		};
	}

	function draw() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		localPlayer.draw(ctx);

		for (var i = 0; i < remotePlayers.length; i++) {
			remotePlayers[i].draw(ctx);
		};

		drawPlayerCounter();
	}

	function drawPlayerCounter() {
		ctx.fillStyle = "#ff0000";
		ctx.fillText("Players online: " + (remotePlayers.length + 1), 10, 10);
	}

	function playerById(id) {
		for (var i = 0; i < remotePlayers.length; i++) {
			if (remotePlayers[i].id == id)
				return remotePlayers[i];
		};

		return false;
	}

	// function testColision(rect1, rect2) {
	// 	if (rect1.getX() < rect2.getX() + rect2.width &&
	// 		rect1.getX() + rect1.width > rect2.getX() &&
	// 		rect1.getY() < rect2.getY() + rect2.height &&
	// 		rect1.height + rect1.getY() > rect2.getY()) {

	// 	}
	// }

})();