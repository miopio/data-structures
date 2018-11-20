const { Client } = require('pg');

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

// Sample SQL statement to create a table: 
var thisQuery = "CREATE TABLE sensorData ( sensorValue integer, sensorTime timestamp DEFAULT current_timestamp );";
//var thisQuery = "SELECT * FROM sensorData;";
client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});