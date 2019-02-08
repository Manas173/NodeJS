var os=require('os');
var yargs=require('yargs');
var fs=require('fs');
//var _=require('lodash');
var notes=require('./notes.js');
var feedback='Unable to access , command fault !!!';
const command=process.argv[2];
const request=require('request');
const argv=yargs.options({
	address:{
		demand:true,
		string:true
	}
	})
	.help()
	.alias('help','h')
	.alias('address','a')
	.argv;
//const argv=yargs.
//	command('addNote','Add a newnote',{
//		title: {
//			describe:'The title of the user',
//			demand:true
//		},
//		body: {
//			describe:'The body for each title',
//			demand: true
//		}
//	}).help().alias('help','h').argv;
debugger;
var handle=encodeURIComponent(argv.a);
//console.log(handle);
request({
	url:`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${handle}&key=AIzaSyDMYuu1EyK9oYhjdlnGbSW_iPrh-LRh264`,
	json:true
	},(error,response,body)=>{
	if(error)
		console.log("ERROR OCCURED");
	else if(body.status==="ZERO_RESULTS")
		console.log("NO RESULTS FOR THE INPUT");
	else if(body.status==="OK")
	{
		console.log(body.results[0].geometry.location.lat);
		console.log(body.results[0].geometry.location.lng);
	}
})

//var decURI="Hey ther 20e%20I am using Kali";
//var encURI=encodeURIComponent(decURI);
//decURI=decodeURIComponent("Hey there%20I%20am%20Manas");
//console.log(encURI);
//console.log(decodeURIComponent(encURI));
//console.log(decURI);
if(command==='addNote')
	feedback=notes.readNote(argv);
else if(command==='deleteNote')
	feedback=notes.deleteNote(argv);
else if(command==='deleteAllNote')
	feedback=notes.deleteAllNote();
else if(command==='replaceNote')
	feedback=notes.replaceNote();
else if(command==='Error')
	feedback='Please fill all the required fields';
console.log(feedback);
