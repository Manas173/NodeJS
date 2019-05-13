require('./../config/config');
var {mongoose} = require('../mongoose.js');
var express = require('express');
var bodyParser = require('body-parser');
var {Todo} = require('../models/Todo.js');
var {Userz} = require('../models/Users.js');
var {ObjectId} = require('mongodb');
var {authenticate} = require('./authentication/authenticate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const _ = require('lodash');
const path = require('path');
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
const {Users} = require('./utils/users.js');
var users = new Users();

app.use(bodyParser.json());
app.use(express.static(publicPath));
app.use(bodyParser.urlencoded({
	extended: true
}));

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
		socket.join(params.room);
		users.removeUser(socket.id);
		users.addUser(socket.id,params.name,params.room);
		io.to(params.room).emit('updateUserList',users.getUserList(params.room))
		socket.emit('newMessage',{
			from: 'Admin',
			text: 'Welcome to the chat App',
			createdAt: moment().valueOf()
		})
		socket.broadcast.to(params.room).emit('newMessage',{
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

	socket.on('createLocationMessage',(coords,callback)=>{
		var user = users.getUser(socket.id);
		if(user){
			io.to(user.room).emit('newLocationMessage',generateLocationMessage(user.name,`${coords.latitude},${coords.longitude}`))
		}
	})

	socket.on('createEmail',(email) => {
		console.log('Email arrived',email)
		io.emit('newMail',{
			from: email.from,
			text: email.text,
			createdAt : new Date().getTime()
		})
	})

	socket.on('createMessage',(message,callback) => {
			var user = users.getUser(socket.id);
			if(user && isRealString(message.text)){
			io.to(user.room).emit('newMessage',generateMessage(user.name,message.text))
		}
	})

	socket.on('disconnect',()	=>	{
		console.log('User was disconnected !')
		var user = users.removeUser(socket.id);
		if(user){
			io.to(user.room).emit('updateUserList',users.getUserList(user.room));
			io.to(user.room).emit('newMessage',generateMessage('Admin',`${user.name} has left`));
		}
	})

})


app.post('/todo',authenticate,(req,res)=>{
	var obj=new Todo({
		text: req.body.text,
		_creator: req.user._id
	});
	obj.save().then((response)=>{
		res.send(response);
	},(err)=>{
		res.status(400).send('Error while posting');
	})
})

app.get('/todos/:id',authenticate,(req,res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id))
		return res.status(404).send()
	Todo.findOne({_id:id ,
			 _creator:req.user._id}).then((response)=>{
		if(!response)
			return res.status(400).send('Not found')
		res.status(200).send({response});
	}).catch((e)=>{
		res.status(404).send('Not valid')
	})
})

app.get('/todos',authenticate,(req,res)=>{
	Todo.find({_creator: req.user._id}).then((response)=>{
		res.send({response});
	},(err)=>{
		res.status(400).send({err});
	})
})

app.get('/todo',authenticate,(req,res)=>{
	Todo.find({_creator : req.user._id}).then((response)=>{
		res.send({response});
	},(err)=>{
		res.status(400).send({err});
	})
})

app.get('/users/me',authenticate,(req,res)=>{
	res.send(req.user);
})

// app.post('/user',(req,res)=>{
// 	var obj = new Users({
// 		email: req.body.email,
// 		name: req.body.name
// 	})
// 	obj.save().then((response)=>{
// 		res.send('Saved user');
// 	},(err)=>{
// 		res.status(400).send(err);
// 	})
// })

app.post('/users',(req,res)=>{
	var body = _.pick(req.body,['email','password','college','name','roll']);
	var obj = new Userz(body);

	obj.save().then(()=>{
		return obj.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth',token).redirect('/join.html').send(obj);
	}).catch((e)=>{
		res.status(401).send({"status": 401,
		"error":"Data is missing , all fields are required !"});
	})
})

app.post('/users/login',(req,res) => {
	var body = _.pick(req.body,['email','password'])
	// if(!req)
	// 	res.status(404).send('Invalid request');

	Userz.findByCredentials(body.email,body.password).then((response) => {
		return response.generateAuthToken().then((token) => {
			res.header('x-auth',token).redirect('/join.html').send(response);
		}).catch((e) => {
			console.log(e);
		})
	}).catch((e) => {
		res.status(401).send({"status": 401,
		"error":"UserID and Password combination is incorrect"});
	})

	// Users.findOne({email: body.email}).then((resp) => {
	// 	bcrypt.compare(body.password,resp.password,(error,response) => {
	// 		if(error)
	// 			console.log(error);
	// 		if(response === true)
	// 			res.send({message: 'Authentication completed successfully', email: body.email});
	// 		else
	// 			res.status(400).send({message: 'Authentication failed ID or password did not match', email: body.email})
	// 	})
	// }).catch((e) => {
	// 	res.status(404).send({message: 'Authentication failed ID or password did not match', email: body.email})
	// })
})

app.delete('/todos/:id',authenticate,(req,res)=>{
	var id = req.params.id;
	if(!ObjectId.isValid(id))
		return res.status(400).send({'message':'Invalid ID'});
	Todo.findOneAndRemove({_id : id,
						_creator: req.user._id}).then((response)=>{
		if(!response)
			return res.status(404).send({'message':'ID not found !'})
		res.status(200).send({response});
	}).catch((e)=>{
		res.status(400).send({'message':'Error occured !'});
	})
})


app.delete('/users/me/token',authenticate,(req,res) => {
	var token = req.header('x-auth');
	req.user.removeToken(token).then(() => {
		res.status(200).send();
	},() => {
		res.status(400).send();
	})
})

app.patch('/todos/:id',authenticate,(req,res)=>{
	var id = req.params.id;
	var body = _.pick(req.body,['text','completed']);

	if(!ObjectId.isValid(id))
		return res.status(404).send();

	if(_.isBoolean(body.completed) && body.completed)
		body.completedAt = new Date().getTime();
	else
	{
		body.completed = false;
		body.completedAt = null;
	}

	Todo.findOneAndUpdate({_id:id,
						_creator: req.user._id},{$set : body},{new : true}).
		then((response)=>{
			if(!response)
				return res.status(404).send();
			res.send({response});
		}).catch((e)=>{
			res.status(400).send(e);
		})
})


server.listen(PORT,()=>{
	console.log(`Server is up on PORT ${PORT} !`)
})



module.exports = {
	app
};