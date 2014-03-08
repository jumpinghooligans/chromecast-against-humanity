var socket;

$(document).ready(function() {
	socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');
	//socket = io.connect('http://localhost');

	$("#examples").click(function() {
		socket.emit("sender-message", { action : "exampleCards" });
	});
});