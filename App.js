var os=require('os');
var yargs=require('yargs');
var fs=require('fs');
//var _=require('lodash');
var notes=require('./notes.js');

const command=process.argv[2];
const argv=yargs.argv;
var feedback='Unable to access , command fault !';
if(command==='addNote')
	feedback=notes.readNote(argv);
else if(command==='deleteNote')
	feedback=notes.deleteNote(argv);
else if(command==='deleteAllNote')
	feedback=notes.deleteAllNote();
else if(command==='replaceNote')
	feedback=notes.replaceNote();
console.log(feedback);
