const {MongoClient,ObjectId} = require('mongodb');

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

// MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
// 	if(err)
// 		return console.log('Unable to connect !');
// 	console.log('Conneted to mongodb !');
// 	db.collection('Todos').insertOne({
// 		text:'This is a random text',
// 		completed: false
// 	},(err,result)=>{
// 		if(err)
// 			return console.log('Unable to insert document to Todos !');
		// console.log(JSON.stringify(result.ops,undefined,2));
	// 	console.log(result.ops);
	// });

	// db.collection('Users').insertOne({
	// 	name: 'Manas Ranjan Swain',
	// 	age: 21,
	// 	location: 'Ranchi'
	// },(err,result)=>{
	// 	if(err)
	// 		return console.log('Unable to insert document into Users',err);
		// console.log(JSON.stringify(result.ops,undefined,2));
		// console.log(JSON.stringify(result.ops,undefined,2));
// 	})
// 	db.close();
// });
MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	db.collection('Users').find({_id: new ObjectId("5c6cffa672a74965dc3ab289")}).toArray().then((result)=>{
		console.log(result);
	}).catch((err)=>{
		console.log('Error has occured!');
		console.log(err);
	})

	db.collection('Users').find({name: 'Ranjan'}).toArray().then((response)=>{
		console.log(response);
	}).catch((err)=>{
		console.log('Error occured',err);
	})
});
























