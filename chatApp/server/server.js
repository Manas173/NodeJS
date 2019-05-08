const path = require('path');
const express = require('express');
var app = express();
const publicPath = path.join(__dirname,'../public');
const socketIO = require('socket.io');
var PORT = process.env.PORT || 3000;
var http = require('http');
var server = http.createServer(app);
var io = socketIO(server);
var moment = require('moment');
const {isRealString} = require('./utils/validation.js');
var {generateMessage,generateLocationMessage} = require('./utils/message');

app.use(express.static(publicPath));

io.on('connection',(socket) => {
	console.log('New user connected !');

	// socket.emit('newMessage',{
	// 	from: 'Admin',
	// 	text: 'Welcome to the chat App',
	// 	createdAt: moment().valueOf()
	// })

	socket.on('join',(params,callback) => {
		if(!isRealString(params.name)|| !isRealString(params.room)){
			callback('Username and roomname are required !');
		}
		socket.emit('newMessage',{
			from: 'Admin',
			text: 'Welcome to the chat App',
			createdAt: moment().valueOf()
		})
		socket.broadcast.emit('newMessage',{
			from: 'Admin',
			text: `${params.name} has joined`,
			createdAt: moment().valueOf()
		})
		callback();
	})

	// socket.broadcast.emit('newMessage',{
	// 	from: 'Admin',
	// 	text: 'New user joined',
	// 	createdAt: moment().valueOf()
	// })

	socket.on('createLocationMessage',(coords)=>{
		io.emit('newLocationMessage',generateLocationMessage('Admin',`${coords.latitude},${coords.longitude}`))
	})

	socket.on('createEmail',(email) => {
		console.log('Email arrived',email)
		io.emit('newMail',{
			from: email.from,
			text: email.text,
			createdAt : new Date().getTime()
		})
	})

	socket.on('createMessage',(message) => {
			io.emit('newMessage',{
				from: message.from,
				text: message.text,
				createdAt: new Date().getTime()
			})
	})

	socket.on('disconnect',()	=>	{
		console.log('User was disconnected !')
	})

})

server.listen(PORT,()=>{
	console.log(`Server is up on PORT ${PORT} !`)
})