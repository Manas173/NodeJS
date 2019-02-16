var db = require('./db.js')

var handleInput = (email,password) => {
	//Check if email already exists
	db.addUser({ // this will not call addUser in db.js intead a spy
		email,
		password
	});
	//Save the email
}

module.exports={
	handleInput
};