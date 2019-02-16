const expect = require('expect');		//spy is present in expect module
const rewire = require('rewire');
var app = rewire('./App.js');
describe('Creating and testing using spies ',()=>{
	var db = {
		addUser: expect.createSpy()	//here spy will be creeated which later is replaced
	};
	app.__set__('db',db);	//Replaces db in App.js with the db variable
	it('Checking replaced db by spy synchronously',()=>{
		var email='manasranjanswain173@gmail.com';
		var password='123abc';
		app.handleInput(email,password);
		expect(db.addUser).toHaveBeenCalled();
	});
	it('Creating spy in synchronous method',()=>{
		var spy=expect.createSpy();
		spy('Manas',25);		//Calling spy explicitly not calling will cause error in the assertion below
		expect(spy).toHaveBeenCalled().toHaveBeenCalledWith('Manas',25);
	})
})