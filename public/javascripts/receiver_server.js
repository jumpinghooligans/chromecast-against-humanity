$(document).ready(function() {
	var socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	socket.emit('sender-message', { userAgent : navigator.userAgent });
	socket.on('sender-message', function(data) {
		$("#message").text(JSON.stringify(data));
	});
});