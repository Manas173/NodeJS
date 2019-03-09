var mongoose = require('mongoose');
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
	},
	completedAt:{
		type: Number,
		default: null
	}
});
console.log(Todo.find())
module.exports = {
	Todo
}