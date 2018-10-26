var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');

var apiKey = process.env.TAMU_KEY; 

var latlong = []; //hold results of request

//requested these individually to avoid mistakes/ using up credits on Geolocation site
var addresses = JSON.parse(fs.readFileSync('parsed_data/parsed_m01.json'));
let x = addresses.map(x=> x.meeting_address);
console.log(x);
    
async.eachSeries(x, function(value, callback) {
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
    apiRequest += 'streetAddress=' + value.split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';
    
    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            console.log(tamuGeo['FeatureMatchingResultType']);
        latlong.push(tamuGeo);
        }
    });
    setTimeout(callback, 2000);
}, function() {
    fs.writeFileSync('latlong_data/geo_m01.json', JSON.stringify(latlong));
    console.log('*** *** *** *** ***');
    console.log('Number of meetings in this zone: ');
    console.log(latlong.length);
    
});

