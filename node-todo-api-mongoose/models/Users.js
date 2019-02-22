var {mongoose} = require('../mongoose.js');
var Users = mongoose.model('Users',{
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