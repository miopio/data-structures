var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone'); // moment-timezone --save


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

// FOR QUERY ENDPOINTS: 1) sensor 2) aameetings 3) deardiary

// respond to requests for /sensor
app.get('/sensor', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query: tried several to test what I could output. 
    
    //Get date (DDMMYYYY) from sensorTime in EST, then count the number of sensorValues that are above 500 each given day
    //which will give the number of minutes I've been at my desk        
    var q = `SELECT date_trunc('day', sensorTime AT TIME ZONE 'UTC' AT TIME ZONE 'EST') as sensorDay,
             COUNT(sensorValue::int) as desktime
             FROM sensorData
             WHERE sensorValue > 500
             GROUP BY sensorDay
             ORDER BY sensorDay;`; 
    
    //Get date (DDMMYYYY) from sensorTime in EST as sensorDay, as well as date and time (DDMMYYYY-HHMM) as sensorMin
    //(both from sensrTime), then count the number of sensorValues that are above 500 each given day
    //which will give the number of minutes I've been at my desk
    var m = `SELECT date_trunc('day', sensorTime AT TIME ZONE 'UTC' AT TIME ZONE 'EST') as sensorDay,
             date_trunc('minute', sensorTime AT TIME ZONE 'UTC' AT TIME ZONE 'EST') as sensorMin
             FROM sensorData
             WHERE sensorValue > 500
             GROUP BY sensorDay, sensorMin
             ORDER BY sensorDay;`;
             
    //responds to query q
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
    
    // SQL query for aa data(tried out several to test it out)
    
    //Gets the address, location, and day & start time as meetings, from aameetings data where the day is Monday, grouping by address and location
    var thisQuery1 = `SELECT address, location as location, json_agg(json_build_object('day', day, 'time', starttime)) as meetings
                 FROM aameetingsdata 
                 WHERE day = 'Monday'
                 GROUP BY address, location
                 ;`;
    
    //Get latitude, longitude, as well as location, address, start time, name, day, type, and special interests grouped as meetings. Group by latitude and longitude
    var thisQuery = `SELECT lat, long, json_agg(json_build_object('location', location, 'address', address, 'time', starttime, 'name', name, 'day', day, 'type', type, 'interest', interest)) as meetings
                 FROM aameetingsdata 
                 GROUP BY lat, long
                 ;`;
                 
    //responds to thisQuery:
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
    // For mood category (which is my PK, and in this case, mood = "happy"), get values. Later extract objects of interest.
    var params = {
        TableName: "dearDiary",
        KeyConditionExpression: "mood = :mood", // the query expression
        ExpressionAttributeValues: { // the query values
            ":mood": { S: "happy" }
        }
    };
    
    //response to params
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




// FOR VISUALIZATIONS

// Sensor Data Visualization
// With a force sensitive resistor, measures how much time I am sitting at my desk at work vs working in the lab, in meetings, or generally
// in other areas. This is done by putting an apple on top of the sensor whenever I am at my desk.

//Set up HTML
var s1x = `<!DOCTYPE html>
<meta charset="utf-8">
<style>
body {
  font: 12px sans-serif;
}

#myDiv{
    height: 500px
}
</style>

<body>
<h2>Work Patterns: Desk Time vs Lab Time</h2>
<p>How much time do you spend sitting at your desk vs moving around in the lab or in meetings?</p>
<div id="myDiv"><!-- Plotly chart will be drawn inside this DIV --></div>
<p>The average amount of time you spend at your desk at work daily is <b id="average"></b> out of approx. 9-10hrs of total work time.</p>

<script src="https://d3js.org/d3.v3.min.js"></script>
<script src="https://labratrevenge.com/d3-tip/javascripts/d3.tip.v0.6.3.js"></script>
<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script>

var data = `;

//Set up javascript
var s2x = `; 

console.log(data);
console.log(data.length);

// Set up arrays for both sensorday and desktime
var sensorday = [];
var desktime = [];

for (i = 0; i < data.length; i++){
    sensorday.push(data[i].sensorday)
    desktime.push(data[i].desktime)
}

console.log(sensorday);
console.log(desktime); 

//convert desktime to hrs and mins for labeling graph (desktime is in minutes only), then push new Times to new array
function timeConvert(n) {
var num = n;
var hours = (num / 60);
var rhours = Math.floor(hours);
var minutes = (hours - rhours) * 60;
var rminutes = Math.round(minutes);
return rhours + "hr" + rminutes + "min";
}

var newTimes = [];

for (i = 0; i<desktime.length; i++){
console.log(timeConvert(desktime[i]))
newTimes.push(timeConvert(desktime[i]))
};

console.log(newTimes);

//Set up bar graph to plot sensor data using Plotly.js. X axis will show the date, Y axis will show time spent at desk in minutes
var trace1 = {
  x: sensorday,
  y: desktime,
  type: 'bar',
  text: newTimes,
  hoverinfo: 'text',
  marker: {
    color: 'rgb(250, 128, 114)'
  }
};

var data1 = [trace1];

var layout = {
  title: 'Amount of Time Spent at Desk at Work',
  font:{
    family: 'Raleway, sans-serif'
  },
  showlegend: false,
  xaxis: {
    title: 'Date',
    tickangle: -45
  },
  yaxis: {
    title: 'Time at Desk (min)',
    zeroline: false,
    gridwidth: 2
  },
  bargap :0.05
};

Plotly.newPlot('myDiv', data1, layout);

//Get the average time spent at desk
var sum = 0;
for( var i = 0; i < desktime.length; i++ ){
    sum += parseInt( desktime[i], 10 ); 
}
var avg = sum/desktime.length;

//Log avg time spent at desk
console.log(avg);
var totalavg = timeConvert(avg);
document.getElementById("average").innerHTML = totalavg.toString();

</script>`;

//Get data from database. Get date (DDMMYYYY) from sensorTime in EST, then count the number of sensorValues that are above 500
//each given day, which will give the number of minutes I've been at my desk        
app.get('/ss', function(req, res) {
    
    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query 
 var q = `SELECT date_trunc('day', sensorTime AT TIME ZONE 'UTC' AT TIME ZONE 'EST') as sensorDay,
             COUNT(sensorValue::int) as desktime
             FROM sensorData
             WHERE sensorValue > 500
             GROUP BY sensorday
             ORDER BY sensorday;`; 

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = s1x + JSON.stringify(qres.rows) + s2x; 
            res.send(resp);
            client.end();
            console.log('4) responded to request for sensor graph');
        }
    });
});


// AA Meetings Visualization
// Map meeting locations scraped from aa meetings data on map. Show meeting information in popup in the event of a click.

// Set up HTML. Use leaflet.js for mapping capabilities
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <style>
    #mapid {
        height:760px;
   }
   
   h2{
       font-family: sans-serif;
   }
   
   body{
       font: 12px sans-serif;
   }
  </style>

  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
</head>

<body>
<h2>AA Meetings in Manhattan</h2>
<p>An overview of all of the AA meetings occuring in Manhattan. Select for meetings occuring each day during the week by toggling the layers on the upper right hand corner. Click on the markers to see relevant meeting info. </p>
<div id="mapid"></div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  
   var data = `;
   
// Set up javascript. Use latitude and longitude variables to set up locations of markers. Insert location, address, name, day, start time, type, and interest from aameetingsdata into popup.  
var jx = `;
    
    // Put meetings for different days in different arrays (monMeetings thru sunMeetings)
    monMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Monday"){
            monMeetings.push(data[i]);
        }
        else{
            console.log("not Monday");
        }
    }
    console.log(monMeetings);
    
    tuesMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Tuesday"){
            tuesMeetings.push(data[i]);
        }
        else{
            console.log("not Tuesday");
        }
    }
    console.log(tuesMeetings);
    
    wedMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Wednesday"){
            wedMeetings.push(data[i]);
        }
        else{
            console.log("not Wednesday");
        }
    }
    console.log(wedMeetings);
    
    thursMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Thursday"){
            thursMeetings.push(data[i]);
        }
        else{
            console.log("not Thursday");
        }
    }
    console.log(thursMeetings);
    
    friMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Friday"){
            friMeetings.push(data[i]);
        }
        else{
            console.log("not Friday");
        }
    }
    console.log(friMeetings);
    
    satMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Saturday"){
            satMeetings.push(data[i]);
        }
        else{
            console.log("not Saturday");
        }
    }
    console.log(satMeetings);
    
    sunMeetings = [];
    for (var i = 0; i<data.length; i++){
        if(data[i].day == "Sunday"){
            sunMeetings.push(data[i]);
        }
        else{
            console.log("not Sunday");
        }
    }
    console.log(sunMeetings);
    
    //create arrays for each group of markers corresponding to each day
    var Mondays = [];
    for (var i=0; i<monMeetings.length; i++) {
        Mondays.push(L.marker( [monMeetings[i].lat, monMeetings[i].long]).bindPopup('<b>Location: </b>' +  monMeetings[i].location + '<br />' + '<b>Address: </b>' + monMeetings[i].address + '<br />' + '<b>Name: </b>' + monMeetings[i].name + '<br />' + '<b>Day: </b>' + monMeetings[i].day + '<br />' + '<b>Time: </b>' + monMeetings[i].starttime + '<br />' + '<b>Type: </b>' + monMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + monMeetings[i].interest));
    }
    
    var Tuesdays = [];
    for (var i=0; i<tuesMeetings.length; i++) {
        Tuesdays.push(L.marker( [tuesMeetings[i].lat, tuesMeetings[i].long]).bindPopup('<b>Location: </b>' +  tuesMeetings[i].location + '<br />' + '<b>Address: </b>' + tuesMeetings[i].address + '<br />' + '<b>Name: </b>' + tuesMeetings[i].name + '<br />' + '<b>Day: </b>' + tuesMeetings[i].day + '<br />' + '<b>Time: </b>' + tuesMeetings[i].starttime + '<br />' + '<b>Type: </b>' + tuesMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + tuesMeetings[i].interest));
    }
    
    var Wednesdays = [];
    for (var i=0; i<wedMeetings.length; i++) {
        Wednesdays.push(L.marker( [wedMeetings[i].lat, wedMeetings[i].long]).bindPopup('<b>Location: </b>' +  wedMeetings[i].location + '<br />' + '<b>Address: </b>' + wedMeetings[i].address + '<br />' + '<b>Name: </b>' + wedMeetings[i].name + '<br />' + '<b>Day: </b>' + wedMeetings[i].day + '<br />' + '<b>Time: </b>' + wedMeetings[i].starttime + '<br />' + '<b>Type: </b>' + wedMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + wedMeetings[i].interest));
    }
    
    var Thursdays = [];
    for (var i=0; i<thursMeetings.length; i++) {
        Thursdays.push(L.marker( [thursMeetings[i].lat, thursMeetings[i].long]).bindPopup('<b>Location: </b>' +  thursMeetings[i].location + '<br />' + '<b>Address: </b>' + thursMeetings[i].address + '<br />' + '<b>Name: </b>' + thursMeetings[i].name + '<br />' + '<b>Day: </b>' + thursMeetings[i].day + '<br />' + '<b>Time: </b>' + thursMeetings[i].starttime + '<br />' + '<b>Type: </b>' + thursMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + thursMeetings[i].interest));
    }    
        
    var Fridays = [];
    for (var i=0; i<friMeetings.length; i++) {    
        Fridays.push(L.marker( [friMeetings[i].lat, friMeetings[i].long]).bindPopup('<b>Location: </b>' +  friMeetings[i].location + '<br />' + '<b>Address: </b>' + friMeetings[i].address + '<br />' + '<b>Name: </b>' + friMeetings[i].name + '<br />' + '<b>Day: </b>' + friMeetings[i].day + '<br />' + '<b>Time: </b>' + friMeetings[i].starttime + '<br />' + '<b>Type: </b>' + friMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + friMeetings[i].interest));
    }
    
    var Saturdays = [];
    for (var i=0; i<satMeetings.length; i++) {    
        Saturdays.push(L.marker( [satMeetings[i].lat, satMeetings[i].long]).bindPopup('<b>Location: </b>' +  satMeetings[i].location + '<br />' + '<b>Address: </b>' + satMeetings[i].address + '<br />' + '<b>Name: </b>' + satMeetings[i].name + '<br />' + '<b>Day: </b>' + satMeetings[i].day + '<br />' + '<b>Time: </b>' + satMeetings[i].starttime + '<br />' + '<b>Type: </b>' + satMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + satMeetings[i].interest));
    }    
        
    var Sundays = [];
    for (var i=0; i<sunMeetings.length; i++) {    
        Sundays.push(L.marker( [sunMeetings[i].lat, sunMeetings[i].long]).bindPopup('<b>Location: </b>' +  sunMeetings[i].location + '<br />' + '<b>Address: </b>' + sunMeetings[i].address + '<br />' + '<b>Name: </b>' + sunMeetings[i].name + '<br />' + '<b>Day: </b>' + sunMeetings[i].day + '<br />' + '<b>Time: </b>' + sunMeetings[i].starttime + '<br />' + '<b>Type: </b>' + sunMeetings[i].type + '<br />' + '<b>Special Interests: </b>' + sunMeetings[i].interest));
    }

    //Create layer groups for each day
     var meetingDays = L.layerGroup(Mondays);
     var meetingDays2 = L.layerGroup(Tuesdays);
     var meetingDays3 = L.layerGroup(Wednesdays);
     var meetingDays4 = L.layerGroup(Thursdays);
     var meetingDays5 = L.layerGroup(Fridays);
     var meetingDays6 = L.layerGroup(Saturdays);
     var meetingDays7 = L.layerGroup(Sundays);
    
    var streetmap = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
	attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
        maxZoom: 18,
        id: 'mapbox.streets',
        // accessToken: 'your.mapbox.access.token'
        accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
    });
    
    //Create the map with different layers
    var mymap = L.map('mapid', {
    center: [40.734636,-73.994997], 
    zoom:13, 
    layers: [streetmap, meetingDays, meetingDays2, meetingDays3, meetingDays4, meetingDays5, meetingDays6, meetingDays7]
    });
    
    var baseMaps = {
        "streetmap": streetmap
    };
    var meetingDays = {
        "Monday Meetings": meetingDays,
        "Tuesday Meetings": meetingDays2,
        "Wednesday Meetings": meetingDays3,
        "Thursday Meetings": meetingDays4,
        "Friday Meetings": meetingDays5,
        "Saturday Meetings": meetingDays6,
        "Sunday Meetings": meetingDays7
    };

    //Add a selection control for the layers
    L.control.layers(baseMaps, meetingDays).addTo(mymap);
    
    /*for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].long]).bindPopup('<b>Location: </b>' +  data[i].location + '<br />' + '<b>Address: </b>' + data[i].address + '<br />' + '<b>Name: </b>' + data[i].name + '<br />' + '<b>Day: </b>' + data[i].day + '<br />' + '<b>Time: </b>' + data[i].starttime + '<br />' + '<b>Type: </b>' + data[i].type + '<br />' + '<b>Special Interests: </b>' + data[i].interest).addTo(mymap);
    }*/
    
    </script>
    </body>
    </html>`;
    
// respond to requests for /aameetings
app.get('/aa', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York"); 
    var dayy = now.day().toString(); 
    var hourr = now.hour().toString(); 

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    // SQL query: query each variable separately (not grouped in JSON aggregation) to make it easier to work with when binding it to popup.
    var thisQuery = `SELECT lat, long, location, address, starttime, name, day, type, interest
                 FROM aameetingsdata 
                 GROUP BY lat, long, location, address, starttime, name, day, type, interest
                 ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        
        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('5) responded to request for aa meeting data');
        }
    });
});


// Dear Diary Visualization
// My Dear Diary consists of recording my general mood for each day, and trying to see what sorts of variables have influenced it. 
// Primary Key is "mood", Sort Key is the date.
// Other variables include happiness, productivity, and stress levels (all on scale of 1-10), a string about what generally happened that day,
// link to a significant news article that day, link to music I listened to that day, a string about what sort of human interaction I had that day,
// How much and what type of exercise I did, how many drinks I had, and how long I meditated.
// For this visualization, I've used a portion of these variables to break down components of my mood when I was happy.

// Set up HTML
var h3x = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Dear Diary</title>
  <meta name="description" content="dear diary data">
  <meta name="author" content="DDiary">
</head>
<style>
body {
  font: 12px sans-serif;
}
#myDiv{
    height: 600px;
}

</style>

<body>
<h2>Daily Mood Breakdown</h2>
<p>What is your day to day mood influenced by? We explore different moods based on general mood, and then break it down into several components.
<br />We compare self-reported levels of happiness, productivity, and stress ranging in levels from 1 to 10, and also record short blurbs of a general 
<br />summary and perceived social interaction from that day.</p>
<div id="myDiv"><!-- Plotly chart will be drawn inside this DIV --></div>

<script src="https://cdn.plot.ly/plotly-latest.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.7.2/p5.js"></script>
<script type=”text/javascript” src=”ply.js”></script>
<script>

   var data = `;

// Set up javascript using Plotly.js. Graph happiness, productivity, and stress levels (y axis) by dates when I was happy (x axis).
// On hover, you will be able to see the strings I inputted that day for general happenings of that day, and notable social interactions I had that day.
var h4x =  `; 

//Push components of query into arrays to make data easier to manipulate.
var music = [];
var productivity = [];
var happiness = [];
var stress = [];
var dt = [];
var blurb = [];
var interaction =[];

for (var i = 0; i<data.length; i++){
    console.log(data[i].productivity, data[i].happiness, data[i].stress, data[i].music, data[i].dt, data[i].blurb, data[i].interaction)
    music.push(data[i].music);
    productivity.push(data[i].productivity);
    happiness.push(data[i].happiness);
    stress.push(data[i].stress);
    dt.push(data[i].dt);
    blurb.push(data[i].blurb);
    interaction.push(data[i].interaction);
};
console.log(music);
console.log(productivity);
console.log(happiness);
console.log(stress);
console.log(dt);
console.log(blurb);
console.log(interaction);

//Convert epoch time into EST
newDates = [];
for (i = 0; i < dt.length; i++){
var d = new Date(dt[i]);
var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
console.log(d);
newDates.push(d);
}
console.log(newDates);

// Set up grouped bar graph. Make bars for happiness, productivity, and stress levels and group them together for each day I was happy.
// On hover, set up popup that visualizes blurb about general happenings that day, and about notable social interactions I had that day.
var happiness = {
  x: newDates,
  y: happiness,
  type: 'bar',
  name: 'Happiness Level',
  text: blurb,
  hoverinfo: 'text',
  marker: {
    color: 'rgb(250, 128, 114)',
  }
};

var productivity = {
  x: newDates,
  y: productivity,
  type: 'bar',
  name: 'Productivity Level',
  text: interaction,
  hoverinfo: 'text',
  marker: {
    color: 'rgb(249,166,2)'
  }
};

var stress = {
  x: newDates,
  y: stress,
  type: 'bar',
  name: 'Stress Level',
  hoverinfo: 'none',
  marker: {
    color: 'rgb(255,209,42)'
  }
};
var data = [happiness, productivity, stress];

var layout = {
  title: 'Mood: Happy',
  xaxis: {
    title: 'Date'
  },
  yaxis: {
      title: 'Level (1-10)',
      range: [0,10]
  },
  barmode: 'group'
};

Plotly.newPlot('myDiv', data, layout);
  
</script>
</body>
</html>`;


// respond to requests for /deardiary
app.get('/dd', function(req, res) {

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB.DocumentClient();
    
    // DynamoDB (NoSQL) squery
    // For mood category, get values (in this case, mood = happy).
    var params = {
        TableName: "dearDiary",
        KeyConditionExpression: "mood = :mood", // the query expression
        ExpressionAttributeValues: { // the query values
            ":mood": "happy" 
        }
    }
    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            var resp = h3x + JSON.stringify(data.Items) + h4x;
            res.send(resp);
            console.log('6) responded to request for dear diary data');
        }
    });

}); 

    
//Hello world starter
//app.get('/home/ec2-user/environment/data/final_assignment', (req, res) => res.send('Hello World!'));

// serve static files in /public
app.use(express.static('/home/ec2-user/environment/data/final_assignment/public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});