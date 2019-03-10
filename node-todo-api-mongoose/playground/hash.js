const {SHA256} = require('crypto-js');

var value = 4;
var hash = SHA256(value).toString();

var data = {
	id: 4
};

var token = {
	data,
	token : SHA256(JSON.stringify(data)+'itsthesecret').toString()	//Adding SALT
}

console.log(token);