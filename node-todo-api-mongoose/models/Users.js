var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var _ = require('lodash');


var UserSchema = new mongoose.Schema({
	email:{
		unique: true,
		trim: true,
		required: true,
		minLength: 1,
		type: String,
		validate:{
			validator: validator.isEmail,
			message: '{VALUE} is not avlid email'
		}
	},
	password:{
		type: String,
		required: true,
		minLength: 6,
		trim: true
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
})

UserSchema.statics.findByToken = function(token) {
	var user = this;
	var decoded;

	try{
		decoded = jwt.verify(token,'abc123');
	}catch(e){
		return Promise.reject()
	}

	return Users.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
}

UserSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(),access},'abc123').toString();
	
	user.tokens = user.tokens.concat([{access,token}]);

	return user.save().then(()=>{
		return token;
	})
}

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject,['_id','email']);
}

var Users = mongoose.model('users',UserSchema);

module.exports = {
	Users
};