const app=require('./server').app;
const request=require('supertest');
const expect=require('expect');

describe('Server',()=>{
	
	describe('Users',() => {
	it('Testing hello world',(done)=>{
		request(app)
		.get('/users')
		.expect(200)
		.expect((res)=>{
			expect(res.body).toInclude({
				name: 'Manas',
				age: 21,
				location: 'Ranchi'
			})
		})
		.end(done);
	})

	it('Testing hello world',(done)=>{
		request(app)
		.get('/users')
		.expect(200)
		.expect((res)=>{
			expect(res.body).toInclude({
				name: 'Raja',
				age: 20,
				location: 'Jamshedpur'
			})
		})
		.end(done);
	})
	})


	describe('Home page',()=>{
		it('Home Page',(done)=>{
			request(app)
				.get('/')
				.expect(404)
				.expect((res)=>{
					expect(res.body).toInclude({error: 'Page Not Found !'})
				})
				.end(done)
		})
	})	
})




































// const request = require('supertest');
// const expect = require('expect');
// var app = require('./server').app;

// it('Testing express',(done)=>{
// 	request(app)
// 	.get('/')
// 	.expect((res)=>{
// 		expect(res.body)
// 			.toInclude({
// 				error: 'Page Not Found !'
// 			})
// 	})
// 	.expect(404)
// 	.end(done);
// })

// it('Searching my name in users',(done)=>{
// 	request(app)
// 		.get('/users')
// 		.expect(200)
// 		.expect((res)=>{
// 			expect(res.body)
// 			.toInclude({
// 				name: 'Manas',
// 				age: 21,
// 				location: 'Ranchi'
// 			})
// 		})
// 		.end(done);
// })