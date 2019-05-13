var {ObjectID} = require('mongodb');
var id = "5c70f701515c55da6a242928";
var {Todo} = require('./models/Todo');
var mongoose = require('./mongoose')

Todo.findById(id).then((response)=>{
	if(!response)
		return console.log('ID not found');
	return console.log(response);
}).catch((e)=>{
	console.log(e);
})