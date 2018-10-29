const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

console.log('start');
// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'miopio';
db_credentials.host = 'datastructures.cmvyyi1w0p9g.us-east-2.rds.amazonaws.com';
db_credentials.database = 'dataStructures';
db_credentials.password = "meow1meow";
db_credentials.port = 5432;

console.log('start');

for(var x=1; x<11;x++) {
    
    if(x<10){
    var addressesForDb = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/aadata/sql_data/sql_m0'+x+'.json'));
    }else{
       var addressesForDb = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/aadata/sql_data/sql_m'+x+'.json')); 
    };


async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    //var thisQuery = "CREATE TABLE aameetingsData (day varchar(25), start varchar(25), end varchar(25), name varchar(100), location varchar(100), address varchar(100), lat double precision, long double precision, region int, type varchar(100), interest varchar(100);";
    var thisQuery = "INSERT INTO aameetingsData VALUES (" + value.day + "', " + value.start + ", " + value.end + ", " + value.name + "', " + value.location + ", " + value.address + "" + value.lat + "', " + value.long + ", " + value.region + ", " + value.type + "', " + value.interest + ");";
    var thisQuery = "SELECT * FROM aameetingsData;";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 

