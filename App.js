var os=require('os');
var yargs=require('yargs');
var fs=require('fs');
//var _=require('lodash');
var notes=require('./notes.js');
var feedback='Unable to access , command fault !!!';
const command=process.argv[2];
const request=require('request');
var handleName="tourist";
const argv=yargs.
	command('addNote','Add a newnote',{
		title: {
			describe:'The title of the user',
			demand:true
		},
		body: {
			describe:'The body for each title',
			demand: true
		}
	}).help().alias('help','h').argv;
debugger;

request({
	url:`https://codeforces.com/api/user.info?handles=${handleName}`,
	json:true
	},(error,response,body)=>{
	console.log('Error: ',error);
	console.log('Body is: ',body);
})

var decURI="Hey there I am using Kali";
var encURI=encodeURIComponent(decURI);
console.log(encURI);
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
