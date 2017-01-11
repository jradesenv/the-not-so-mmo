var util = require("util"),
    io = require("socket.io"),
    Player = require("./player"),
    port = process.env.PORT || 3000,
    http = require('http'),
    express = require('express'),
    app = express();
var socket, players;

function start() {
    var server = http.createServer(app);
    
    players = [];
    socket = io(server);
    configEventHandlers();

    // Listen for requests
    app.use(express.static(__dirname + '/public'));  
    app.get('/', function(req, res,next) {  
        res.sendFile(__dirname + '/index.html');
    });

    server.listen(port, function() {
        var port = server.address().port;
        util.log("Server is running in port " + port + "...");
    });
}

function configEventHandlers() {
    socket.on('connection', onSocketConnection);
}

function onSocketConnection(client) {
    util.log("Player connected: " + client.id);
    client.on("disconnect", onClientDisconnect);
    client.on("new-player", onNewPlayer);
    client.on("move-player", onMovePlayer);
    client.on("new-message", onNewMessage);
}

function onClientDisconnect() {
    util.log("Player has disconnected: " + this.id);
    var removePlayer = playerById(this.id);

    if (!removePlayer) {
        return;
    };

    players.splice(players.indexOf(removePlayer), 1);
    this.broadcast.emit("remove-player", { id: this.id });

    sendMessage(this, {
        name: "SERVIDOR",
        msg: "Jogador [" + removePlayer.name + "] saiu.",
        adm: true
    });
}

function sendMessage(socket, msgData) {
    socket.broadcast.emit("new-message", msgData);
}

function onNewPlayer(data) {
    var newPlayer = new Player(this.id, data.name, data.x, data.y);
    this.broadcast.emit("new-player", { id: newPlayer.id, name: newPlayer.name, x: newPlayer.getX(), y: newPlayer.getY() });

    for (var i = 0; i < players.length; i++) {
        var existingPlayer = players[i];
        this.emit("new-player", { id: existingPlayer.id, name: existingPlayer.name, x: existingPlayer.getX(), y: existingPlayer.getY() });
    };

    players.push(newPlayer);

    sendMessage(this, {
        name: "SERVIDOR",
        msg: "Jogador [" + newPlayer.name + "] entrou.",
        adm: true
    });
}

function onMovePlayer(data) {
    var movePlayer = playerById(this.id);

    if (!movePlayer) {
        return;
    };

    movePlayer.setX(data.x);
    movePlayer.setY(data.y);

    this.broadcast.emit("move-player", { id: movePlayer.id, x: movePlayer.getX(), y: movePlayer.getY() });
}

function onNewMessage(data) {
    sendMessage(this, data);
}

function playerById(id) {
    for (var i = 0; i < players.length; i++) {
        if (players[i].id == id)
            return players[i];
    };

    return false;
}

start();