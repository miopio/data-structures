const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'miopio';
db_credentials.host = 'datastructures.cmvyyi1w0p9g.us-east-2.rds.amazonaws.com';
db_credentials.database = 'dataStructures';
db_credentials.password = process.env.AWSRDS_PW;;
db_credentials.port = 5432;

console.log('start');

for(var x=1; x<11;x++) {
    
    if(x<10){
    var addressesForDb = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/aadata/parsed_data/parsed_m0'+x+'.json'));
    }else{
       var addressesForDb = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/aadata/parsed_data/parsed_m'+x+'.json')); 
    };

//var addressesForDb = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/week3/meetingLocations.txt'));
//var addressesForDb = [ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lon: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lon: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lon: -73.99447889999999 } } ];
//console.log(addressesForDb);
//var thisQuery = "CREATE TABLE aameetingsData (id serial, meeting_name varchar(75), location_name varchar(75), meeting_address varchar(100), meeting_day varchar(30), meeting_start varchar(25), meeting_end varchar(25), meeting_topic(100), meeting_interests(100), PRIMARY KEY(id);";


async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
        client.connect();
    
    var id = result.indexOf(value);
    var mondays = data[id]['meeting_times']['Monday'];
    var tuesdays = data[id]['meeting_times']['Tuesday'];
    var wednesdays = data[id]['meeting_times']['Wednesday'];
    var thursdays = data[id]['meeting_times']['Thursday'];
    var fridays = data[id]['meeting_times']['Friday'];
    var saturdays = data[id]['meeting_times']['Saturday'];
    var sundays = data[id]['meeting_times']['Sunday'];
    var test = mondays.length>0;
    var test1 = tuesdays.length>0;
    var test2 = wednesdays.length>0;
    var test3 = thursdays.length>0;
    var test4 = fridays.length>0;
    var test5 = saturdays.length>0;
    var test6 = sundays.length>0;
    //daysLength = [];
    //daysLength = [test, test1, test2, test3, test4, test5, test6];
    
    if(test == true){
        for(var i=0;i<mondays.length;i++){
            var day = "Monday";
            var topic = mondays[i]['details']['topic'];
            var interest = mondays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Monday.start + ", " + value.meeting_times.Monday.end + ", " + value.meeting_times.Monday.topic + ", " + value.meeting_Monday.interests +");";
        }
    if(test1 === true){
        for(var i=0; i<tuesdays.length;i++){
            var day = "Tuesday";
            var topic = tuesdays[i]['details']['topic'];
            var interest = tuesdays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Tuesday.start + ", " + value.meeting_times.Tuesday.end + ", " + value.meeting_times.Tuesday.topic + ", " + value.meeting_Tuesday.interests +");";
        }
    if(test2 === true){
        for(var i=0; i<wednesdays.length;i++){
            var day = "Wednesday";
            var topic = wednesdays[i]['details']['topic'];
            var interest = wednesdays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Wednesday.start + ", " + value.meeting_times.Wednesday.end + ", " + value.meeting_times.Wednesday.topic + ", " + value.meeting_Wednesday.interests +");";
        }        
    if(test3 === true){
        for(var i=0; i<thursdays.length;i++){
            var day = "Thursday";
            var topic = thursdays[i]['details']['topic'];
            var interest = thursdays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Wednesday.start + ", " + value.meeting_times.Thursday.end + ", " + value.meeting_times.Thursday.topic + ", " + value.meeting_Thursday.interests +");";
        }                
    if(test4 === true){
        for(var i=0; i<fridays.length;i++){
            var day = "Friday";
            var topic = fridays[i]['details']['topic'];
            var interest = fridays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Wednesday.start + ", " + value.meeting_times.Friday.end + ", " + value.meeting_times.Friday.topic + ", " + value.meeting_Friday.interests +");";
        }       
    if(test5 === true){
        for(var i=0; i<saturdays.length;i++){
            var day = "Saturday";
            var topic = saturdays[i]['details']['topic'];
            var interest = saturdays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Wednesday.start + ", " + value.meeting_times.Saturday.end + ", " + value.meeting_times.Saturday.topic + ", " + value.meeting_Saturday.interests +");";
        }       
    if(test6 === true){
        for(var i=0; i<sundays.length;i++){
            var day = "Sunday";
            var topic = sundays[i]['details']['topic'];
            var interest = sundays[i]['details']['interest'];
        var thisQuery = "INSERT INTO aameetingsData VALUES (E'" + value.id + "', " + value.meeting_name + ", " + value.location_name + ", " + value.meeting_address + "," + day + ", " + value.meeting_times.Wednesday.start + ", " + value.meeting_times.Sunday.end + ", " + value.meeting_times.Sunday.topic + ", " + value.meeting_Sunday.interests +");";
        }      
    }
}


    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000);