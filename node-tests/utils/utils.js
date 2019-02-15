var add = (a,b) => a + b;
var square = (x) => x * x;
var username = (user,fullname) => {
	const names=fullname.split(' ');
	user.firstName=names[0];
	user.lastName=names[1];
	return user
}
var addAsync = (a,b,cal) => {
	cal(a+b);
}
var squareAsync = (a,callback) => {
	callback(a*a);
}
module.exports={
	add,
	square,
	username,
	addAsync,
	squareAsync
};