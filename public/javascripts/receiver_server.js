var socket;

$(document).ready(function() {
	socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	socket.emit('sender-message', { data : navigator.userAgent });
});

function updateServer(text) {
	socket.emit('sender-message', { data : text });
}