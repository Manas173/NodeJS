const bcrypt = require('bcryptjs');

var password = 'abc123';

bcrypt.genSalt(10,(err,salt) => {
	bcrypt.hash(password,salt,(err,hash) => {
		console.log(salt);
		console.log(hash);
	})
})

var hashedPassword = '$2a$10$YWKy.dZO/aEjkE1M5bUtHeqOB0KZmNmMM0YgQHfHmLn.xPbnvqKL.';

bcrypt.compare(password,hashedPassword,(err,res)=>{
	if(err)
		return console.log(err);
	console.log(res);
})


// const jwt = require('jsonwebtoken');

// var data = {
// 	id: 4
// };

// var token = jwt.sign(data,'itsthesecret');

// var decode = jwt.verify(token,'itsthesecret');
// console.log(decode);

// if(decode.id === data.id)
// 	console.log('Verified');
// else
// 	console.log('Not Verified Do Not Trust');

// const {SHA256} = require('crypto-js');

// var value = 4;
// var hash = SHA256(value).toString();

// var data = {
// 	id: 4
// };

// var token = {
// 	data,
// 	token : SHA256(JSON.stringify(data)+'itsthesecret').toString()	//Adding SALT
// }

// console.log(token);