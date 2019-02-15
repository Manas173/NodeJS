const request = require('supertest');
const expect = require('expect');
var app = require('./server').app;

it('Testing express',(done)=>{
	request(app)
	.get('/')
	.expect((res)=>{
		expect(res.body)
			.toInclude({
				error: 'Page Not Found !'
			})
	})
	.expect(404)
	.end(done);
})

it('Searching my name in users',(done)=>{
	request(app)
		.get('/users')
		.expect(200)
		.expect((res)=>{
			expect(res.body)
			.toInclude({
				name: 'Manas',
				age: 21,
				location: 'Ranchi'
			})
		})
		.end(done);
})