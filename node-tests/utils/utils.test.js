const utils=require('./utils');
const expect=require('expect');
it('should add 33 and 11',()=>{
	var res = utils.add(33,11);
	expect(res).toBe(44).toBeA('number');
	// if(res!==44)
	// 	throw new Error(`Expected 44 but got ${res}`);
});

it('should square 5',()=>{
	var sq = utils.square(5);
	expect(sq).toBe(25);
	// expect(25).toExist();
	// if(sq!==25)
	// 	throw new Error(`Expected 25 but got ${sq}`);
})

it('Checking other expect assertions',()=>{
	expect({
		name: 'Manas',
		age:21,
		location: 'Ranchi'
	}).toInclude({age:21});
})

it('Checking name',()=>{
	var fullname='Manas Ranjan Swain';
	var user={
		age:21,
		location:'Ranchi'
	};
	user=utils.username(user,fullname);
	expect(user).toInclude({
		firstName:'Manas',
		lastName:'Ranjan'
	});
})
it('Checking add Async',(don)=>
{
	setTimeout(() => {
		utils.addAsync(2,5,(sum)=>{
			expect(sum).toBe(7).toBeA('number');
			don();
		})
	},1000);
})

it('Check square of a number',(done) => {
	utils.squareAsync(5,(sq)=>{
		expect(sq).toBe(25).toBeA('number');
		done();
	})
})