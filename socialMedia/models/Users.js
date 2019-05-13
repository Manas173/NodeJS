var mongoose = require('mongoose');
var validator = require('validator');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
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
	name:{
		type: String,
		minLength: 3,
		trim:true,
		required: true
	},
	college:{
		type: String,
		minLength: 5,
		trim:true,
		required: true
	},
	roll:{
		type: String,
		minLength: 5,
		trim: true,
		required:true
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
		decoded = jwt.verify(token,process.env.JWT_SECRET);
	}catch(e){
		return Promise.reject()
	}

	return Userz.findOne({
		_id: decoded._id,
		'tokens.token': token,
		'tokens.access': 'auth'
	})
}

UserSchema.methods.removeToken = function(token) {
	var user = this;
	return user.update({
		$pull: {
			tokens: {token}
		}
	})
}

UserSchema.pre('save',function(next){
	var user = this;
	if(user.isModified('password')){
		bcrypt.genSalt(10,(err,salt) => {
			bcrypt.hash(user.password,salt,(err,hash) => {
				user.password = hash ;
				next();
			});

		})
	}else{
		next();
	}
})

//creating model method findByCredentials

UserSchema.statics.findByCredentials = function(email,password) {
	var Userz = this;
	return Userz.findOne({email}).then((res) => {
		if(!res)
			return Promise.reject();
		return new Promise((resolve,reject) => {
			bcrypt.compare(password,res.password,(e,r) => {
				if(e)
					reject();
				if(r === false)
					reject();
				resolve(res);
			})
		})
	})
}

UserSchema.methods.generateAuthToken = function() {
	var user = this;
	var access = 'auth';
	var token = jwt.sign({_id: user._id.toHexString(),access},process.env.JWT_SECRET).toString();
	
	user.tokens = user.tokens.concat([{access,token}]);

	return user.save().then(()=>{
		return token;
	})
}

UserSchema.methods.toJSON = function() {
	var user = this;
	var userObject = user.toObject();

	return _.pick(userObject,['_id','email','name','college','roll']);
}

var Userz = mongoose.model('users',UserSchema);

module.exports = {
	Userz
};