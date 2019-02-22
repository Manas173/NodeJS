var {mongoose} = require('../mongoose.js');
var express = require('express');
var bodyParser = require('body-parser');
var {Todo} = require('../models/Todo.js');
var {Users} = require('../models/Users.js');

var app = express();

app.use(bodyParser.json());

app.post('/todo',(req,res)=>{
	var obj=new Todo({
		text: req.body.text
	});
	obj.save().then((response)=>{
		res.send(response);
	},(err)=>{
		res.status(400).send('Error while posting');
	})
})

app.post('/user',(req,res)=>{
	var obj = new Users({
		email: req.body.email,
		name: req.body.name
	})
	obj.save().then((response)=>{
		res.send('Saved user');
	},(err)=>{
		res.status(400).send(err);
	})
})

app.listen(3000,()=>{
	console.log(`Server connected to port 3000`);
})

module.exports = {
	app
};