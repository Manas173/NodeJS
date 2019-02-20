const {MongoClient,ObjectId} = require('mongodb');

// MongoClient.connect("mongodb://localhost:27017/TodoApp",(err,db)=>{
	//deleteMany
	// db.collection('Todos').deleteMany({text: 'Take a bath'});
	//deleteOne Deletes the first encountered object
	// db.collection('Todos').deleteOne({text:'This is a random text'}).then((response)=>{
	// 	console.log('Deleted Successfully',response);
	// }).catch((err)=>{
	// 	console.log('Error while deleting file',err);
	// });
	//findOneAndDelete finds the first similar obj then delete
// 	db.collection('Todos').findOneAndDelete({text: 'This is a random text'}).then((response)=>{
// 		console.log('deleted successfully',response);
// 	})
// })
//findOneAndDelete

//db.close();

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	db.collection('Todos').findOneAndDelete({_id: new ObjectId("5c6b74133d56f328bdcc1a16")}).then((response)=>{
		console.log('Deleted',response)
	}).catch((err)=>{
		console.log('Error while reading and deleting',err);
	})

	db.collection('Todos').deleteMany({text: 'This is a random text'}).then((response)=>{
		console.log('Deleted all text',response)
	}).catch((err)=>{
		console.log('Deleted all text',err);
	})
})