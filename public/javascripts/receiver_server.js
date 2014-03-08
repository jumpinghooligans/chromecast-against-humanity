$(document).ready(function() {
	var socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	socket.emit('sender-message', { data : navigator.userAgent });
	socket.on('sender-message', function(data) {
		$("#message").text(JSON.stringify(data));
	});
});

function updateServer(text) {
	socket.emit('sender-message', { data : text });
}