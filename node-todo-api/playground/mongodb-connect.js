const MongoClient = require('mongodb').MongoClient;

// MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
// 	if(err)
// 		return console.log('Unable to connect to the database');
// 	console.log('Conneted to the database');
// 	db.collection('Todos').insertOne({
// 		text:'Something to add',
// 		completed:false
// 	},(err,result)=>{
// 		if(err)
// 			return console.log('Unable to insert into collection !');
// 		console.log(JSON.stringify(result.ops,undefined,2));
// 	})
// 	db.close();		//Disconnect from server
// });

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	if(err)
		return console.log('Unable to connect !');
	console.log('Conneted to mongodb !');
	db.collection('Todos').insertOne({
		text:'This is a random text',
		completed: false
	},(err,result)=>{
		if(err)
			return console.log('Unable to insert document to Todos !');
		console.log(JSON.stringify(result.ops,undefined,2));
	});

	db.collection('Users').insertOne({
		name: 'Manas Ranjan Swain',
		age: 21,
		location: 'Ranchi'
	},(err,result)=>{
		if(err)
			return console.log('Unable to insert document into Users');
		console.log(JSON.stringify(result.ops,undefined,2));
	})
	db.close();
});