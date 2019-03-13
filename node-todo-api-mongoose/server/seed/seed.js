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
		token: jwt.sign({_id: userOneId, access: 'auth'},'abc123').toString()	
	}]
},{
	_id: userTwoId,
	email: 'trail2user@gmail.com',
	password: 'passwordForSecondUser'
}];

var populateUser = (done) => {
	Users.remove({}).then(() => {
		var userOne = Users(users[0]).save();	//Sends promises
		var userTwo = Users(users[1]).save();	
		return Promise.all([userOne,userTwo]);
	}).then(() => done());
}

module.exports = {
	users,
	populateUser
}