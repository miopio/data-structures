const { Client } = require('pg');
var async = require('async');
var fs = require('fs');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'miopio';
db_credentials.host = 'data-structures.cfypqjoxqik8.us-east-1.rds.amazonaws.com';
db_credentials.database = 'dataStructures';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var addressesForDb = JSON.parse(fs.readFileSync('/home/ec2-user/environment/data/week3/meetingLocations.txt'));

async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " + value.latLong.lon + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
