var mongoose = require('mongoose');
var validator = require('validator');
var Users = mongoose.model('users',{
	email:{
		required:true,
		minLength:1,
		type: String,
		unique: true,
		trim: true,
		validator:(value)=>{
			return validator.isEmail;
		},
		message: '{VALUE} is not a valid email'
	},
	password:{
		minLength: 6,
		type: String
	},
	tokens:[{
		access:{
			type: String,
			required: true
		},
		token:{
			type: String,
			required: true
		}
	}]
});

module.exports = {
	Users
};