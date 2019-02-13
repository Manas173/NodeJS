var request=require('request');
var getTemperature = (latitude,longitude,callback) => {
request({
	uri:`https://api.darksky.net/forecast/70fc8519fc3880ee4a529008278917d3/${latitude},${longitude}`,
	json: true},(error,response,body)=>{
		if(!error && response.statusCode===200)
			callback(undefined,{
				temperature : body.currently.temperature,
				apparentTemperature : body.currently.apparentTemperature});
		else
			callback(undefined,'Error temeperature data not received !');
	});
}
module.exports = {
	getTemperature
};