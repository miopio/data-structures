// npm install aws-sdk
var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

var dynamodb = new AWS.DynamoDB();

//query where mood = 'happy' and dates are between Oct 5 and Oct 23; then filter it further with stress levels equal to or below 5

var params = {
    TableName : "dearDiary",
    KeyConditionExpression: "mood = :mood and dt between :minDate and :maxDate",
    FilterExpression: "stress <= :stress",
    ExpressionAttributeValues: { // the query values
        ":mood": {S: 'happy'},
        ":minDate": {N: new Date("October 5, 2018").valueOf().toString()},
        ":maxDate": {N: new Date("October 23, 2018").valueOf().toString()},
        ":stress": {N: '5'}
    }
};

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});