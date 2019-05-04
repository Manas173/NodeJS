const path = require('path');
const express = require('express');
var app = express();
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
var PORT = process.env.PORT || 3000;
var http = require('http');
var server = http.createServer(app);
var io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection',(socket) => {
	console.log('New user connected !');

	socket.on('createEmail',(email) => {
		console.log('Email arrived',email)
		io.emit('newMail',{
			from: email.from,
			text: email.text
		})
	})

	socket.on('disconnect',()	=>	{
		console.log('User was disconnected !')
	})

})

server.listen(PORT,()=>{
	console.log(`Server is up on PORT ${PORT} !`)
})