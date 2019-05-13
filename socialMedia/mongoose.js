var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://mrs123:mrs123@ds155076.mlab.com:55076/authentication');

module.exports ={
	mongoose
}