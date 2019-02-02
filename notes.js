var _=require('lodash');
var fs=require('fs');
var notes=[];
var obj={
	title:'',
	body:''};
var duplicateNote;
var findDuplicates=(argv)=>{
	obj.title=argv.title;
	obj.body=argv.body;
	try{
                notes=JSON.parse(fs.readFileSync('note.json'));
		duplicateNote=notes.filter((obj1)=>obj1.title===argv.title);
        }
        catch(e){
		duplicateNote=[];
		notes=[];
        }
}

var readNote = (argv) => {
	findDuplicates(argv);
	console.log(duplicateNote);
	if(duplicateNote.length==0)
	{
		notes.push(obj);
		fs.writeFileSync('note.json',JSON.stringify(notes));
		return "Added Successfully";
	}
	else
		return "Already exists";
}

var deleteNote = (argv) => {
	findDuplicates(argv);
	if(duplicateNote.length===0)
		return 'Note does not exists';
	console.log(duplicateNote);
	notes=notes.filter((obj) => obj.title!==argv.title);
	fs.writeFileSync('note.json',JSON.stringify(notes));
	return 'Removed successfully';
}
var replaceNote = (argv) =>{
	return 'To be done later';
}
var deleteAllNote = () => {
	return 'To be done later';
}

module.exports={
   readNote,
   deleteNote,
   deleteAllNote,
   replaceNote
};
