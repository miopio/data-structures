var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'miopio';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'dataStructures';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

console.log(db_credentials.host)


// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
   /* var q = `SELECT EXTRACT(DAY FROM sensorTime) as sensorday,
             AVG(sensorValue::int) as num_obs
             FROM sensorData
             GROUP BY sensorday
             ORDER BY sensorday;`; */
             
    //change UTC time to EST time, then count the sensor values that are more than 500. Group by time         
   /* var q = `SELECT sensorTime AT TIME ZONE 'UTC' AT TIME ZONE 'Eastern Standard Time',
             EXTRACT(DATE FROM sensorTime) as localTime
             COUNT(sensorValue) as deskTime
             FROM sensorData
             HAVING min(deskTime) > 500
             GROUP BY localTime
             ORDER BY localTime;`;  */
    
    //Get date (DDMMYYYY) from sensorTime, then count the number of sensorValues that are above 500 each given day
    //which will give the number of minutes I have spent at my work desk   
    var q = `SELECT CAST(sensorTime AS DATE) as sensorday,
             COUNT(sensorValue::int) as desktime
             FROM sensorData
             WHERE sensorValue > 500
             GROUP BY sensorday
             ORDER BY sensorday;`;
             


    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
}); 

// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query 
    var thisQuery = `SELECT address, location as location, json_agg(json_build_object('day', day, 'time', starttime)) as meetings
                 FROM aameetingsdata 
                 WHERE day = 'Monday'
                 GROUP BY address, location
                 ;`;
                 

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
}); 

// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    // DynamoDB (NoSQL) squery
    // For each mood category, get values. Then extract happiness/productivity/stress values and music URL value from that later.
    var params = {
        TableName: "dearDiary",
        KeyConditionExpression: "mood = :mood", // the query expression
        //ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        //    "#tp": "topic"
        //},
        ExpressionAttributeValues: { // the query values
            ":mood": { S: "happy" }
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

}); 

//Hello world starter
//app.get('/home/ec2-user/environment/data/week10', (req, res) => res.send('Hello World!'));

// serve static files in /public
app.use(express.static('/home/ec2-user/environment/data/week10/public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});