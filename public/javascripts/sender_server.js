var socket;

$(document).ready(function() {
	socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');
	//socket = io.connect('http://localhost');

	var player_info = {};

	player_info.game = "example";
	player_info.id = "ryan";
	player_info.role = "player";

	socket.emit("register", player_info);

	$("#examples").click(function() {
		socket.emit("sender-message", { action : "exampleCards", player_info : player_info });
	});
});