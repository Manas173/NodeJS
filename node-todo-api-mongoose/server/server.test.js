const request = require('supertest'); 
const expect = require('expect');
var {app} = require('./server.js');
var {Todo} = require('../models/Todo.js')

beforeEach((done)=>{
	Todo.remove({}).then(()=> done());
});

describe('POST /todo',()=>{
	it('Checking if user is POSTED or not',(done)=>{
		var text='This is a test 123';
		request(app)
			.post('/todo')
			.send({text})
			.expect(200)
			.expect((res)=>{
				//console.log(JSON.stringify(res,undefined,2));
				expect(res.body.text).toBe(text);
			})
			.end((err,response)=>{
				if(err)
					return console.log(err);
				Todo.find().then((res)=>{
				expect(res.length).toBe(1);
				expect(res[0].text).toBe(text);
				done();
				}).catch((err)=>{
					done(err);
			});
		})
	});

	it('Checking if post is going empty or not !',(done)=>{
		request(app)
			.post('/todo')
			.send({})
			.expect(400)
			.end((err,res)=>{
				if(err)
					return console.log(err);
				Todo.find().then((res)=>{
					expect(res.length).toBe(0);
					done();
				},(e)=>{
					done(e);
				})
			})
	})
});