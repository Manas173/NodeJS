var mongoose = require('mongoose');
var Users = mongoose.model('users',{
	email:{
		required:true,
		minLength:1,
		type: String,
		trim: true
	},
	name:{
		required:true,
		minLength: 1,
		trim: true,
		type: String
	}
});

module.exports = {
	Users
};