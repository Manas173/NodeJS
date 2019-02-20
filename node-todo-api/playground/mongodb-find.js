const {MongoClient,ObjectId} = require('mongodb');
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