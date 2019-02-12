const yargs=require('yargs');
const axios=require('axios');

const argv=yargs.options({
		a: {
			alias:'address',
			string:true,
			demand:true
		}
	})
	.help()
	.alias('h','help')
	.argv;

const address=encodeURIComponent(argv.address);
const geocodeURI=`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${address}&key=AIzaSyDMYuu1EyK9oYhjdlnGbSW_iPrh-LRh264`;
axios.get(geocodeURI).then((response)=>{
	if(response.data.status==='OK')
	{
		const latitude=response.data.results[0].geometry.location.lat;
		const longitude=response.data.results[0].geometry.location.lng;
		const weatherURI=`https://api.darksky.net/forecast/70fc8519fc3880ee4a529008278917d3/${latitude},${longitude}`;
		return axios.get(weatherURI);
	}
	else if(response.data.status==='ZERO_RESULTS')
		console.log('Could not find the address!');
	else if(response.data.status==='OVER_QUERY_LIMIT')
		console.log('Limit may have exceeded!');
	else
		console.log('Unknown error while fetching data');
}).then((response)=>{
	if(typeof response==="undefined")
		console.log('Weather data was not fetched!');
	else{
		console.log(response.data.currently.apparentTemperature);
		console.log(response.data.currently.temperature);
	}
})
.catch((e)=>{
	console.log(e);
})