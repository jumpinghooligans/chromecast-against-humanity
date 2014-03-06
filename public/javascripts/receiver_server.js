var socket = io.connect('http://chromecast-cards-against.herokuapp.com/');
//console.log(navigator.userAgent);

socket.emit('message', { userAgent : navigator.userAgent });