const request = require('supertest'); 
const expect = require('expect');
const jwt = require('jsonwebtoken');
var {app} = require('./server.js');
var {Todo} = require('../models/Todo.js')
var {ObjectId} = require('mongodb');
var {users,populateUser} = require('./../server/seed/seed.js');
var {Users} = require('./../models/Users'); 

var todos = [{
	_id: new ObjectId(),
	text: 'This is one test'
},{
	_id: new ObjectId(),
	text: 'This is a test 123',
	completed : true,
	completedAt: null
}]

beforeEach(populateUser);

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

describe('Testing GET _users_me',()=>{
	it('Testing authenticated users',(done) => {
		request(app)
			.get('/users/me')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString())
				expect(res.body.email).toBe(users[0].email)
			})
			.end((err,res) => {
				if(err)
					return done(err);
				done()
			})
	})

	it('should return 401 if not authenticated',(done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({})
			})
			.end((err,res) => {
				if(err)
					return done(err);
				done();
			})
	})
})

describe('Testing POST users',() => {
	it('Checking if user is authenticated',(done) => {
		var email = 'example@example.com';
		var password = 'examplePassword';
		request(app)
			.post('/users')
			.send({email,password})
			.expect(200)
			.expect((res)=>{
				expect(res.headers['x-auth']).toExist();
				expect(res.body.email).toBe(email);
				expect(res.body._id).toExist();
			})
			.end((err,res) => {
				if(err)
					return done(err);
				Users.findOne({email}).then((response) => {
					if(!response)
						return Promise.reject();
					expect(response).toExist();
					expect(response.email).toBe(email);
					expect(response.password).toNotBe(password);
					done();
				}).catch((e) => {
					done(e);
				})
			})
	})

	it('should return validation errors if request invalid',(done) => {
		var email = 'example2@example.com';
		var password = 'example2password';
		request(app)
			.post('/users')
			.send({password})
			.expect(400)
			.end((err) => {
				if(err)
					return done(err);
				done();
			})
	})

	it('should not create a user if email is use',(done) => {
		var email = users[0].email;
		var password = 'example11Password';
		request(app)
			.post('/users')
			.send({email: users[0].email,
				password})
			.expect(400)
			.end((err) => {
				if(err)
					return done(err);
				Users.findOne({email}).then((res) => {
					expect(res).toExist();
					expect(res.email).toBe(email);
					done();
				}).catch((e) => done(e))
			})
	})
})

describe('TESTING loggingIn',() => {
	it('TEST logIn',(done) => {
		request(app)
			.post('/users/login')
			.send({	email: users[1].email,
					password: users[1].password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toExist();
			})
			.end((err,res) => {
				if(err)
					return done(err);
				Users.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toInclude({
						access: 'auth',
						token: res.headers['x-auth']
					})
					done();
				}).catch((e) => done(e));
			})
	})

	it('should reject invalid login',(done) => {
		request(app)
			.post('/users/login')
			.send({	email: users[1].email,
					password: 'abscdqwe12'})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toNotExist();
			})
			.end((err,res) => {
				if(err)
					return done(err);
				Users.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0)
					done();
				}).catch((e) => done(e));
			})
	})
})

describe('TESTING logging out',() => {
	it('logging out users using token',(done) => {
		request(app)
			.delete('/users/me/token')
			.set('x-auth',users[0].tokens[0].token)
			.expect(200)
			.end((e) => {
				if(e){
					done(e);
				}
				Users.findById(users[0]._id).then((res) => {
					expect(res.tokens.length).toBe(0);
				}).catch((e) => done(e));
				Users.findByToken(users[0].tokens[0].token).then((res) => {
					expect(res).toEqual(null);
					done();
				}).catch((e) => done(e));
			})
	})
})