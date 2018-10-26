const { Client } = require('pg');
const cTable = require('console.table');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'miopio';
db_credentials.host = 'datastructures.cmvyyi1w0p9g.us-east-2.rds.amazonaws.com';
db_credentials.database = 'dataStructures';
db_credentials.password = process.env.AWSRDS_PW;;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to query meetings on Monday that start on or after 7:00pm: 
//var thisQuery = "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";
//var thisQuery = "CREATE TABLE aameetingsData (id serial, meeting_name varchar(75), location_name varchar(75), meeting_address varchar(100), meeting address, meeting_day varchar(30), meeting_start varchar(25), meeting_end varchar(25), meeting_topic(100), meeting_interests(100), PRIMARY KEY(id);";


var thisQuery =  "SELECT meeting_address, location_name FROM aameetingsData WHERE meeting_start = '3:00PM';";
// var thisQuery = "SELECT count(*) from aadata;";
// " = "SELECT count(distinct mtglocation, mtgaddress) FROM aadata;
// "= "SELECT distinct mtgaddress FROM aadata"

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});