var asyncPromise = (a,b) => {
	return new Promise((resolve,reject) => {
		setTimeout(()=>{
		if(typeof a === 'number' && typeof b === 'number')
			resolve(a+b);
		else
			reject("Inputs must be integer");
	},3000);
	})
}
asyncPromise(2,5).then((message)=>{
	console.log('Success: ',message);
	return asyncPromise(message,'38');
},(message)=>{
	console.log('Failure: ',message);
}).then((message)=>{
	console.log('Should be 45: ',message);
}).catch((message)=>{
	console.log('Error caught: ',message);
})
// var somePromise = new Promise((resolve,reject)=>{
// 	resolve('Promise has been resolved');
// 	reject('This wont get settled');
// })
// somePromise.then((message) => {			//message is the message that is passed in resolve's parameter
// 	console.log('Success: ',message);
// },(message)=>{
// 	console.log('Failure: ',message);
// })		//.then() will have both resolve and reject