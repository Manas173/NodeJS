var socket = io();
socket.on('connect',function () {
	console.log('Connected to server !')
})
socket.on('disconnect',function() {
	console.log('Disconnected from server !')
})
socket.on('createEmail', function(email) {
    console.log('New email', email)
})

socket.on('newMail',function(email) {
    console.log(email)
})