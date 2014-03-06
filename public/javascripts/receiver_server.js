var socket = io.connect('http://chromecast-against-humanity.herokuapp.com/');
//console.log(navigator.userAgent);

socket.emit('message', { userAgent : navigator.userAgent });
