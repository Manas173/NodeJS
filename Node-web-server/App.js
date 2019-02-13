const express = require('express');
var hbs=require('hbs');
var app=express();	//new express app
var fs=require('fs');

const PORT=process.env.PORT || 3000;

hbs.registerPartials(__dirname + '/views/partials');

app.set('view engine','hbs');

app.get('/',(req,res)=>{
	res.send({Name:'Manas',
			Roll:'BE1017316'});
})

app.use((req,res,next)=>{
	var log=`${new Date().toString()} ${req.url} : ${req.method}`;
	fs.appendFile('server.log',log+'\n',(err)=>{
		if(err)
			console.log('Error has occur !!!');
	});
	next();
})


app.get('/bad',(req,res)=>{
	res.send({heading:'Request type',
			details:'It is a real bad request'});
})

app.get('/help',(req,res)=>{
	res.render('../help.hbs',{
		message: 'welcome to my website'
	});
})

hbs.registerHelper('screamIt',(word)=>{
	return word.toUpperCase();
})

app.use(express.static(__dirname));

hbs.registerHelper('getCurrentYear',()=>{
	return new Date().getFullYear();
})

app.get('/about',(req,res)=>{
	res.render('About.hbs',{
		pageTitle: 'About the page',
		year: new Date().getFullYear()
	});
})


app.use((req,res,next)=>{
	res.render('maintanence.hbs');
})

app.listen(PORT,()=>{
	console.log(`Server started at PORT ${PORT}`);
});