##Documentation for Final Assignments

Running application: http://18.221.235.98:8080

###Final Assignment 1: AA Meetings Data
The AA Meetings data was perhaps the most difficult dataset to work with, from the web scraping in the beginning, to creating a workable JSON with all of the necessary variables in the right format, to putting all of the data into a PostGreSQL database, to visualizing it. It required many trial and error sessions, debugging, and thinking about how to format the data so we could use it easily in our queries and visualizations. 

We were given HTML files for AA meetings in each of the 10 zones of Manhattan. We converted the HTML files into .txt files, then had to scrape data we deemed necessary to direct potential meeting goers to their meetings of interest. Using TAMU Geoservices, we got the latitudes and longitudes ("lat", "long") of each meeting from parsed addresses. In addition, we parsed these variables for each zone: "day" for day of meeting, "start" for start time,  "end" for end time, "name" for name of the meeting, "location" for the location name, "address" for the address of the location, "region" for what zone the meeting was located in, "type" for type of meeting, and "interest" for special interests of the meeting. Though it sounds like a clear objective, it took a number of tries in order to create the final JSON files for each zone to input into the PostGreSQL database. When we first parsed the files, we had some of the variables nested in each other in the JSON array. This made it incredibly difficult to input into PostGreSQL. We had to back up and structure our parsed data differently so there were no nested variables--then we were able to successfully put our data into the database. The table was created using the query below:

```sql
var thisQuery = "CREATE TABLE aameetingsData (day varchar(25), starttime varchar(25), endtime varchar(25), name varchar(100), location varchar(100), address varchar(100), lat double precision, long double precision, region int, type varchar(100), interest varchar(100));";
``` 

Once we had all of the necessary data within the database, we had to think about how to query this data, and visualize it. Initially, I created a sketch for an interface that was reminiscent of Google Maps: there would be a map with markers that would show meetings of interest, and a side bar that would list the meetings with relevant information. There would be capabilities to search for meetings of different dates and times. After evaluating, I decided to create a simpler visualization in order to focus on functionality rather than capabilities I wouldn't be able to deliver on in time--there would be a map with markers showing meeting info in a popup that would show up when the marker was clicked on. In order to do this, I needed to query my variables individually (not in a JSON aggregation). I queried for lat, long, location, address, start time, name, day, type, and special interest:

```sql
var thisQuery = `SELECT lat, long, location, address, starttime, name, day, type, interest
             FROM aameetingsdata 
             GROUP BY lat, long, location, address, starttime, name, day, type, interest
             ;`;
```

I used Leaflet.js to map our meetings onto a map of Manhattan. Each marker was placed using latitude and longitude data, and by using Leaflet's popup capabilities, I visualized the relevant meeting info for each marker in the popup. Once visualized, I noticed there were four locations that were in Brooklyn (I think there were equivalent street addresses for those four places in both New York, NY and Brooklyn, NY). Those had to be fixed by figuring out what zones these locations were in, and changing the latitude and longitude data to the correct ones. I then decided to create selectable layers, so meetings for different days could be visualized separately to allow for a less cluttered map. I did this by taking the data from the query, and separating the meetings data occuring on different days into arrays. I then put these arrays into different layer groups that I could control. If there were more time, I would like to make the interface I originally wanted to make, allowing the user a better interface for searching and selecting for meetings on different days and times. However, even with this basic visualization, a user could get the relevant information needed to attend an AA meeting in Manhattan.


###Final Assignment 2: Dear Diary Data
The Dear Diary data I decided to collect was data revolving around my mood. I wanted to break down my mood into different components, and figure out what sorts of variables were effecting it. Was it the amount of social interaction I was getting? Was it stress levels? Was it what was happening in the news? In order to gather information for this, I used a DynamoDB database that used the "mood" value as the primary key, and "dt" (date) value as the sort key. For each entry, I collected a blurb as a string that reflected the general happenings of the day, levels of happiness, productivity, and stress on a scale of 1-10, a URL for a significant news article that day, a URL for a song I listened to that day, a string about significant social interactions I had. I also collected data on what exercise I did that day and how much (ie. "squats", "200lbs"), if I drank alcohol, how many drinks did I drink (ie. 4), and if I meditated, how long I meditated for (ie. "20min"). Below shows the variables I collected:

```sql
class DiaryEntry {
  constructor(mood, dt, blurb, happiness, stress, productivity, currentEvents, music, interaction, exercise, alcohol, meditation) {
    this.mood = {};
    this.mood.S = mood;
    this.dt = {}; 
    this.dt.N = new Date(dt).valueOf().toString()
    this.blurb = {};
    this.blurb.S = blurb;
    this.happiness = {};
    this.happiness.N = happiness.toString();
    this.stress = {};
    this.stress.N = stress.toString();
    this.productivity = {};
    this.productivity.N = productivity.toString();
    this.currentEvents = {};
    this.currentEvents.S = currentEvents;
    this.music = {};
    this.music.S = music;
    this.interaction = {};
    this.interaction.S = interaction;
    if (exercise != null) {
      this.exercise = {};
      this.exercise.SS = exercise; 
    }
    if (alcohol != null) {
      this.alcohol = {};
      this.alcohol.N = alcohol.toString();
    }
    if (meditation != null) {
      this.meditation = {}
      this.meditation.S = meditation;
    }
  }
}
``` 

For visualizing my data, I initially started off with a sketch that was entirely out of scope (I was under the impression we had to sketch a fully integrated user interface from the inputting of variables to visualization of all of the variables). I since updated what I wanted to visualize into something more manageable, and decided to focus on days where my mood was "happy". With this query, I got all of the values embedded into each "happy" entry:

```sql
    var params = {
        TableName: "dearDiary",
        KeyConditionExpression: "mood = :mood", 
        ExpressionAttributeValues: { 
            ":mood": { S: "happy" }
        }
    };
``` 

Once I got the necessary entries, I needed to extract my variables of interest from the data. For each "happy" entry, I extracted the date, happiness levels, productivity levels, stress levels, blurbs, and social interaction strings and put the data into corresponding arrays. I decided to use a bar graph to visualize this information, since it was the cleanest way to communicate the varying happiness, productivity, and stress levels for each entry. Using Plotly.js, I created this bar graph showing the different levels for each day (scale of 1-10, y axis), in relation to the date of the "happy" entries (x axis). Using the toolkit capabilities, I visualized the strings I inputted for my general blurb and comments on significant social interactions upon hovering over each group of bars. In the future, I would like to add additional capabilities; it would be nice to visualize some of the other variables as well, but in a different format than the bar graph. In general, working with the DynamoDB database was smooth and reliable. This would not be a difficult project to maintain longitudinally in terms of keeping up with the functionality; the most difficult part was remembering to enter my diary entries. Perhaps because I created so many variables, I made it slightly difficult on myself to keep up with the entries. If I created a simple interface to input my entries, it would definitely help (rather than having to enter it in Cloud9 as one line).


###Final Assignemnt 3: Sensor Data
The sensor that I was assigned was a force sensitive resistor (FSR). This consists of a flat, round area that measures physical pressure, squeezing, and weight. The FSR was circuited to a Photon microcontroller by Particle.io that we could interface with by wifi. The values outputted by the FSR ranged from 0 to ~4000, depending on how much weight was put on it. This value was encoded into a variable called analogvalue. I coded the microcontroller to blink its blue LED whenever the FSR sensed a significant weight on it (analogvalue > 1000), so I could make sure I was getting reliable force information from the FSR (basically so I knew the weight I was putting on it was being sensed by the FSR). I chose to use an analogvalue of > 1000 by trial and error of putting variable amounts of pressure on the FSR and seeing what values it outputted. Because the sensor is not very accurate, even when there is no weight on it, the analogvalue would range from 0 to 10; whenever I would put pressure on it with my fingers, the value would jump to somewhere around 1000 and above. I came to the conclusion that any value over 500 could be considered significant weight, but set the LED blinking value at 1000 just to make sure I was getting proper data.

I created a PostgreSQL database to save the sensor data, which took in the analogvalue as sensorValue, and a corresponding timestamp as sensorTime into a table called sensorData. The database inputted values from the sensor every minute.

```sql
var thisQuery = "CREATE TABLE sensorData ( sensorValue integer, sensorTime timestamp DEFAULT current_timestamp );";
```

I decided to put my FSR at my desk at work. The initial data collection idea was to put my drinks on top of the FSR whenever I was drinking a beverage at work, to record levels of water, caffeine, and other beverages I was drinking. We have different beverages at work, all weighing different amounts (ie coffee mug vs plastic bottle of tea vs can of seltzer)--I thought each container would output a different range of values since they all had different weights. Initially, I was able to record values from different beverages. However, it was very finicky and wouldn't reliably record the value. For example, I would have to spend five minutes trying different arrangements and methods of placing my coffee mug on top of the FSR in order to get a value consistently (in order for the Photon LED to blink throughout the time the mug was placed on top of the sensor). Additionally, the sensor was not sensitive enough to distinguish between some beverages, even if I allotted a range of sensorValues for each item. After troubleshooting for some time, I concluded that I needed a different criteria for data collection.

My next and final data collection objective was to record the amount of time I was sitting at desk vs doing experiments in the lab, or walking around, or going to meetings. I was able to consistently put an apple on top of the FSR and get the Photon LED to blink, meaning it was successfully inputting values corresponding to weight (it was the roundness of the apple that helped with putting pressure on the FSR). Every time I sat at my desk, I put the apple on top of the FSR; whenever I left, I took it off. The values were recorded into the database every minute, giving me the data to determine how many minutes I was at my desk. It took some time to get to this point, but once I figured it out, the data collection was reliable and maintainable, with no problems. 

I tried multiple queries to extract different information from the database, but I eventually settled with this: 

```sql
var q = `SELECT date_trunc('day', sensorTime AT TIME ZONE 'UTC' AT TIME ZONE 'EST') as sensorDay,
             COUNT(sensorValue::int) as desktime
             FROM sensorData
             WHERE sensorValue > 500
             GROUP BY sensorDay
             ORDER BY sensorDay;`; 
``` 

This takes the sensorTime, converts it to EST, and gets the date (YYYYMMDD) as the variable sensorDay, and counts the number of sensorValue inputs that are greater than 500 each day, grouped by sensorDay. This allows me to equate the number of significant sensorValue inputs to number of minutes I was at my desk each day.

I decided visualizing this data in bar graph format would be the simplest and cleanest way to visualize this data. I inputted sensorDay and desktime values into corresponding arrays to use in the visualization. Using Plotly.js, I made a bar graph that shows the number of minutes I sat at my desk (y axis) each day (x axis). I used the tooltip capability to show the time in hours and minutes when the user hover overs one of the bars, for better readability of the data. I made a function that would calculate the average time spent at my desk each day from the query data, so I could know how much time I was spending on average at my desk in a ~8-10 hour work day. It shows the general pattern of my work week pretty well--on Mondays, I usually have several meetings, which means I am at my desk more prepping for the meetings rather than doing experiments. Mid week, I am usually doing long experiments in the lab. On weekends, I am not at work, thus not at my desk. Overall I am satisfied that I was able to manipulate my variables in order to get accurate data fitting the needs of my data collection objectives, and I think this paradigm would be easy to use for anybody who is curious to see how long he/she is in one particular area daily.



