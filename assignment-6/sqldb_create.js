const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'miopio';
db_credentials.host = 'datastructures.cmvyyi1w0p9g.us-east-2.rds.amazonaws.com';
db_credentials.database = 'dataStructures';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

//create table with all meeting data

var thisQuery = "CREATE TABLE aameetingsData (id serial, meeting_name varchar(75), location_name varchar(75), meeting_address varchar(100), meeting_day varchar(30), meeting_start varchar(25), meeting_end varchar(25), meeting_topic(100), meeting_interests(100), PRIMARY KEY(id);";

//attempted to make two tables but not working
//var thisQuery = "CREATE TABLE aameetingsData (id serial, meeting_name varchar(75), location_name varchar(75), meeting_address varchar(100), meeting address, PRIMARY KEY(id);";
//"CREATE TABLE aascheduleData (id int, meeting_day varchar(30), meeting_start varchar(25), meeting_end varchar(25), meeting_topic(100)), meeting_interests(100), PRIMARY KEY (id), CONSTRAINT fk_id FOREIGN KEY (id) REFERENCES aameetingsData (id);";

// Sample SQL statement to create a table: 
//var thisQuery = "CREATE TABLE aadata (address varchar(100), lat double precision, lon double precision);";
// Sample SQL statement to delete a table: 
//var thisQuery = "DROP TABLE aalocations;"; 
// Sample SQL statement to query the entire contents of a table: 

//var thisQuery = "SELECT * FROM aameetingsData;";



client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
    console.log('connected');
});

