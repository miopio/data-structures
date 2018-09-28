var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');

//put code in two parts because I didn't want to run the API requests repeatedly when testing code
//get API info contained in meetingsData2.json obtained from week2 addresses
var meetingsData = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/week3/meetingsData2.json'));

//make sure we have all addresses
console.log(meetingsData.length);


//console.log(meetingsData[2].InputAddress.StreetAddress);
//create new array to input extracted elements into
//for each element in array, we need to extract Street Addresses from Input Address object, and Latitude and Longitude from Output Geocodes object
//make those elements into objects within elements of new array
var output = new Array
for (let i=0; i<meetingsData.length; i++){
    var meeting = {
        address:meetingsData[i].InputAddress.StreetAddress,
        latLong:{lat: meetingsData[i].OutputGeocodes[0].OutputGeocode.Latitude ,lon: meetingsData[i].OutputGeocodes[0].OutputGeocode.Longitude}
    };
    output[i] = meeting;
}
console.log(output)

fs.writeFileSync('/home/ec2-user/environment/data/week3/meetingLocations.txt', JSON.stringify(output))
