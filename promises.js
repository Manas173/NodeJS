var somePromise = new Promise((resolve,reject)=>{
	resolve('Promise has been resolved');
	reject('This wont get settled');
})
somePromise.then((message) => {			//message is the message that is passed in resolve's parameter
	console.log('Success: ',message);
},(message)=>{
	console.log('Failure: ',message);
})		//.then() will have both resolve and reject