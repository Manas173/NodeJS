const request = require('supertest'); 
const expect = require('expect');
var {app} = require('./server.js');
var {Todo} = require('../models/Todo.js')
var {ObjectId} = require('mongodb'); 

var todos = [{
	_id: new ObjectId(),
	text: 'This is one test'
},{
	_id: new ObjectId(),
	text: 'This is a test 123',
	completed : true,
	completedAt: null
}]

beforeEach((done)=>{
	Todo.remove({}).then(()=>{
		return Todo.insertMany(todos);
	}).then(()=> done());
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
				Todo.find({text}).then((res)=>{
				expect(res.length).toBe(2);
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
					expect(res.length).toBe(2);
					done();
				},(e)=>{
					done(e);
				})
			})
	})
});


describe('GET /todos',()=>{
	it('should get all todos',(done)=>{
		request(app)
			.get('/todos')
			.expect(200)
			.expect((res)=>{
				expect(res.body.response.length).toBe(2);
			})
			.end(done);
	})
})

describe('GET /todos/:id',()=>{
	it('Finding in todo',(done)=>{
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.response.text).toBe(todos[0].text)
			})
			.end(done);
	})

	it('id not found',(done)=>{
		request(app)
			.get('/todos/5c70f701515c55da6a242920')
			.expect(400)
			.end(done);
	})

	it('id not valid',(done)=>{
		request(app)
			.get('/todos/5c70f701515c55da6a24292811')
			.expect(404)
			.end(done);
	})

})

describe('Testing delete route',(req,res)=>{

	it('DELETE /todos/',(done)=>{
		var hexId = todos[1]._id.toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res)=>{
				expect(res.body.response._id).toBe(hexId);
			})
			.end((err,res)=>{
				if(err)
					return done(err);
				Todo.findById(hexId).then((response)=>{
					expect(response).toNotExist();
					done();
				}).catch((err)=>{
					done(err);
				})
			})
	})

	it('id not found',(done)=>{
		var hexId = new ObjectId().toHexString();
		request(app)
			.delete(`/todos/${hexId}`)
			.expect(404)
			.end(done);
	})
})

describe('Testing PATCH /todos',()=>{
	it('Testing first /todos update',(done)=>{
		request(app)
			.patch(`/todos/${todos[0]._id}`)
			.send({
				text: 'This is a test update',
				completed : true
			})
			.expect(200)
			.expect((res)=>{
				expect(res.body.response.text).toBe('This is a test update');
				expect(res.body.response.completedAt).toBeA('number');
			})
			.end((err,res)=>{
				if(err)
					return done(err);
				done();
			})

	})

	it('Testing second /todos update',(done)=>{
		request(app)
			.patch(`/todos/${todos[1]._id}`)
			.send({
				text: 'This is second test update',
				completed: false
			})
			.expect(200)
			.expect((res)=>{
				expect(res.body.response.completed).toBe(false);
				expect(res.body.response.completedAt).toBe(null);
			})
			.end((err,res)=>{
				if(err)
					return done(err);
				done();
			})
	})
})