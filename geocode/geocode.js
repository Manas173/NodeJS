var request=require('request');
var geocodeInput=(address,callback)=>{
	var encodedURI=encodeURIComponent(address);
	request({
		uri: `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${encodedURI}&key=AIzaSyDMYuu1EyK9oYhjdlnGbSW_iPrh-LRh264`,
		json: true
	},(error,response,body)=>{
		if(error)
			callback("ERROR IN THE FETCHING !");
		else if(body.status==='ZERO_RESULTS')
			callback("NO RESULTS FOUND FOR THE GIVEN INPUT !");
		else if(body.status==='OK')
		{
			var obj={
				lat:body.results[0].geometry.location.lat,
				lng:body.results[0].geometry.location.lng
			};
			callback(undefined,JSON.stringify(obj,undefined,2));
		}
		else
			callback('Some problem occured');
	})
}

module.exports={
	geocodeInput
};