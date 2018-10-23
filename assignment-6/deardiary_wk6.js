
var diaryEntries = [];

//updated diary entry to include a composite key with mood as primary key and dt as sort key

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

diaryEntries.push(new DiaryEntry('happy', 'October 5, 2018 23:00:00', 'Went to Unter party, met a lot of Germans', 8, 5, 1, "https://www.nytimes.com/2018/10/05/us/politics/brett-kavanaugh-vote-confirmed.html", "https://soundcloud.com/timsweeney/roiperez", "Spent time with best friends, met new people", ["dead lifts", "165lbs"], 5, "20min"));
diaryEntries.push(new DiaryEntry('content', 'October 6, 2018 23:00:00', 'Ate bagels with Fabian and Ana in the park', 7, 5, 1, "https://www.nytimes.com/2018/10/06/us/politics/brett-kavanaugh-supreme-court.html", "https://open.spotify.com/track/3CsnKrOTZr1nIEGzFOQqyZ?si=vPe-RbCeQN2dEKyJ3w4e7w", "Spent time with best friends", ["none", "0"], 0, "0min"));
diaryEntries.push(new DiaryEntry('stressed', 'October 10, 2018 23:00:00', 'Had a lot of pressure to figure out the vagus nerve', 4, 9, 7, "https://informationisbeautiful.net/visualizations/the-microbescope-infectious-diseases-in-context/", "https://open.spotify.com/track/21swDaVehYZMhdnMfMPB9p?si=J776Xu4VQ3m2QfTkW1lphA", "Connected with my OBGYN", ["none", "0"], 0, "20min"));
diaryEntries.push(new DiaryEntry('stressed', 'October 17, 2018 23:00:00', 'Was incredibly stressed out, but did well in DVIA critiques', 3, 9, 9, "https://static.nytimes.com/email-content/NN_6699.html?nlid=76766560", "https://open.spotify.com/track/29UQGa6LTWZSePMsWk3QET?si=b2TE3V4iTUiQnVNPBXpymQ", "Got in a fight with Burning Man lover", ["dead lifts", "180lbs"], 0, "20min"));
diaryEntries.push(new DiaryEntry('happy', 'October 19, 2018 23:00:00', 'Went to Dance Lab, and BAE\'s 2nd anniversary party at Ambrosia Elixirs', 9, 6, 5, "https://www.nytimes.com/2018/10/13/world/middleeast/saudi-arabia-conference-crown-prince-mohammed.html", "https://open.spotify.com/track/29UQGa6LTWZSePMsWk3QET?si=b2TE3V4iTUiQnVNPBXpymQ", "Connected with so many people at Dance Lab", ["none", "0"], 0, "20min"));
diaryEntries.push(new DiaryEntry('neutral', 'October 20, 2018 23:00:00', 'Got dim sum with Nicolas, went to Resolute with friends', 7, 5, 3, "https://www.washingtonpost.com/national/world-digest-oct-20-2018/2018/10/20/093d021c-d478-11e8-8c22-fa2ef74bd6d6_story.html?utm_term=.cc0bf972115c", "https://open.spotify.com/track/29UQGa6LTWZSePMsWk3QET?si=b2TE3V4iTUiQnVNPBXpymQ", "Was nice to catch up with Nicolas", ["none", "0"], 7, "20min"));


console.log(diaryEntries);

var AWS = require('aws-sdk'); // npm install aws-sdk
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

var async = require('async'); 
var dynamodb = new AWS.DynamoDB();

async.eachSeries(diaryEntries, function(value, callback) {
    
    var params = {};
    params.Item = value; 
    params.TableName = "dearDiary";
    
    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
    
    setTimeout(callback, 1000);
}, function() {
    console.log('Done!');
});