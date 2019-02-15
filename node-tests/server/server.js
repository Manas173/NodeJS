var express=require('express');
var app=express();

app.get('/',(req,res)=>{
	res.status(404).send({
		name : 'Server test',
		error : 'Page Not Found !'
	});
})

app.get('/users',(req,res)=>{
	var users=[{
		name: 'Manas',
		age: 21,
		location: 'Ranchi'
	},{
		name: 'Raja',
		age: 20,
		location: 'Jamshedpur'
	},{
		name: 'John',
		age: 45,
		location: 'California'
	}]
	res.send(users);
});

app.listen(3000,()=>{
	console.log('Server connecteed to port 3000');
})
module.exports={
	app
}