var jwt = require('jsonwebtoken');
var {ObjectID} = require('mongodb');
var {Users} = require('./../../models/Users');

var userOneId = new ObjectID();
var userTwoId = new ObjectID();
var users = [{
	_id: userOneId,
	email: 'trail1user@gmail.com',
	password: 'passwordForFirstUser',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'},process.env.JWT_SECRET).toString()	
	}]
},{
	_id: userTwoId,
	email: 'trail2user@gmail.com',
	password: 'passwordForSecondUser',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userTwoId , access: 'auth'},process.env.JWT_SECRET).toString()	
	}]
}];

var todos = [{
	_id: new ObjectID(),
	text: 'This is one test',
	_creator: userOneId
},{
	_id: new ObjectID(),
	text: 'This is a test 123',
	completed : true,
	completedAt: null,
	_creator: userTwoId
}]

var populateUser = (done) => {
	Users.remove({}).then(() => {
		var userOne = Users(users[0]).save();	//Sends promises
		var userTwo = Users(users[1]).save();	
		return Promise.all([userOne,userTwo]);
	}).then(() => done());
}

module.exports = {
	users,
	populateUser,
	todos
}