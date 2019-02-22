var {mongoose} = require('../mongoose.js');
var Todo = mongoose.model('Todo',{
	text:{
		required: true,
		type: String,
		minLength: 1,
		trim: true
	},
	completed:{
		type: Boolean,
		default: false
	}
})

module.exports = {
	Todo
}