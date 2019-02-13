var request = require('request');
var geocodeAddress = (address) => {
	return new Promise((resolve,reject) => {
		var encodedURI = encodeURIComponent(address); 
		request({
			uri:`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedURI}&key=AIzaSyDMYuu1EyK9oYhjdlnGbSW_iPrh-LRh264`,
			json:true
		},
		(error,response,body)=>{
			if(response.statusCode!==200 || body.status==='ZERO_RESULTS')
				reject('The address has not been found !!!');
			else
				resolve({
					lat:body.results[0].geometry.location.lat,
					lng:body.results[0].geometry.location.lng
				})
		})
	})
}

geocodeAddress('835215').then((message)=>{
	console.log(JSON.stringify(message,undefined,2));
},(errorMessage)=>{
	console.log(errorMessage);
})

module.exports={
	geocodeAddress
};