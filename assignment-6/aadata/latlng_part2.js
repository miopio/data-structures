var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');


//get API info from geolocation files
for (var x = 1; x < 10; x++){
    var file = x;
    var latlong = JSON.parse(fs.readFileSync('latlong_data/geo_m0' + file + '.json'));
    var save_path = 'latlong_data/latlong_m0' + file + '.json';

    //make sure we have all addresses
    console.log(latlong.length);

    //for each element in array, extract latitude and longitude from Output Geocodes object
    //make those elements into objects within elements of new array
    var output = new Array
    for (let i=0; i<latlong.length; i++){
        var meeting = {
            //address:latlong[i].InputAddress.StreetAddress,
            latlong:{lat: latlong[i].OutputGeocodes[0].OutputGeocode.Latitude ,lng: latlong[i].OutputGeocodes[0].OutputGeocode.Longitude}
        };
        output[i] = meeting;
    };
console.log(output);
output = JSON.stringify(output);
fs.writeFile(save_path, output, 'utf8');
};

//do it for m10
var x = 10
var file = x;
var latlong = JSON.parse(fs.readFileSync('latlong_data/geo_m' + file + '.json'));
var save_path = 'latlong_data/latlong_m' + file + '.json';

console.log(latlong.length);


var output = new Array
for (let i=0; i<latlong.length; i++){
    var meeting = {
        latlong:{lat: latlong[i].OutputGeocodes[0].OutputGeocode.Latitude ,lng: latlong[i].OutputGeocodes[0].OutputGeocode.Longitude}
    };
    output[i] = meeting;
};
console.log(output);
output = JSON.stringify(output);
fs.writeFile(save_path, output, 'utf8');

