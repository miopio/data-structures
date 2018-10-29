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

var thisQuery = "CREATE TABLE aameetingsData (day varchar(25), start varchar(25), end varchar(25), name varchar(100), location varchar(100), address varchar(100), lat double precision, long double precision, region int, type varchar(100), interest varchar(100);";


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

