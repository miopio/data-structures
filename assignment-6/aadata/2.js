var fs = require('fs');
var request = require('request'); 
var async = require('async'); 
var apiKey = process.env.TAMU_KEY;
console.log(apiKey);

function format(n) {
    return (n < 10) ? ("0" + n) : n;
}

for (var i=10;i<11;i++){
    getgeodata(i);
}

function getgeodata (i){
    var file = format(i);
    // Load data from json
    var addresses = [];
    var json = fs.readFileSync("parsed_data/parsed_m"+file+".json");
    var save_path = "parsed_data/parsed_m"+file+"_geo.json";
    var data = JSON.parse(json);
    var result = [];
    
    for(var i in data)
    result.push(data[i]);
    
    for (var i in data) {
        var address = data[i].meeting_address;
        addresses.push(address);
    }
    
    // test with one address
    // addresses.push(data[0].meeting_address);
    console.log(addresses);
    
    // // eachSeries in the async module iterates over an array and operates on each item in the array in series
    async.eachSeries(addresses, function(value, callback) {
        var id = addresses.indexOf(value);
        console.log(id);
        var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';
        apiRequest += 'streetAddress=' + value.split(' ').join('%20');
        apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
        apiRequest += '&format=json&version=4.01';
        request(apiRequest, function(err, resp, body) {
            if (err) {throw err;}
            else {
                
                // access deeply nested OutputGeocode
                var obj = JSON.parse(body);
                var lat = obj['OutputGeocodes'][0]['OutputGeocode']['Latitude'];
                var lng = obj['OutputGeocodes'][0]['OutputGeocode']['Longitude'];
                
                // Push to meetingsData array
               result[id].latlong = {
                    lat: lat,
                    lng: lng
    			    };
    		   result[id].meeting_address= obj.InputAddress['StreetAddress'];
            }
        });
        setTimeout(callback, 2000);
    }, function() {
        result = JSON.stringify(result);
        fs.writeFile(save_path, result, 'utf8')
        console.log('*** *** *** *** ***');
        console.log('Number of meetings in this zone: ');
        console.log(result.length);
    });
    
}
    