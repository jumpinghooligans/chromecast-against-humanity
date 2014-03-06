$(document).ready(function() {
	var socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');

	socket.emit('ua-message', { userAgent : navigator.userAgent });
	socket.on('ua-message', function(data) {
		$("#message").text(JSON.stringify(data));
	});
});