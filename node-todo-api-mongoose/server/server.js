require('./../config/config');

const port = process.env.PORT;

var {mongoose} = require('../mongoose.js');
var express = require('express');
var bodyParser = require('body-parser');
var {Todo} = require('../models/Todo.js');
var {Users} = require('../models/Users.js');
var {ObjectId} = require('mongodb');
var {authenticate} = require('./authentication/authenticate');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const _ = require('lodash');

var app = express();

app.use(bodyParser.json());

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
	var body = _.pick(req.body,['email','password']);
	var obj = new Users(body);

	obj.save().then(()=>{
		return obj.generateAuthToken();
	}).then((token)=>{
		res.header('x-auth',token).send(obj);
	}).catch((e)=>{
		res.status(400).send(e);
	})
})

app.post('/users/login',(req,res) => {
	var body = _.pick(req.body,['email','password'])
	// if(!req)
	// 	res.status(404).send('Invalid request');

	Users.findByCredentials(body.email,body.password).then((response) => {
		return response.generateAuthToken().then((token) => {
			res.header('x-auth',token).send(response);
		}).catch((e) => {
			console.log(e);
		})
	}).catch((e) => {
		res.status(400).send(e);
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

app.listen(port,()=>{
	console.log(`Server connected to port 3000`);
})

module.exports = {
	app
};