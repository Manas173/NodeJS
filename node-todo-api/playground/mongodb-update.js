const {MongoClient,ObjectId}=require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',(err,db)=>{
	db.collection('Users').findOneAndUpdate({
		name: 'Manas Ranjan Swain'}
		,{
		$set:{
			name: 'Raja'
		},
		$inc:{
			age:-5
		}
	},{
		returnOriginal : false
	}).then((result)=>{
		console.log('Updated successfully',result);
	}).catch((err)=>{
		console.log('Error has occured',err);
	})
})