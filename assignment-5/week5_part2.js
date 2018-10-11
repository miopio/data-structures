var diaryEntries = [];

class DiaryEntry {
  constructor(pk, blurb, happiness, stress, productivity, currentEvents, music, interaction, exercise, alcohol, meditation) {
    this.pk = {};
    this.pk.N = pk.toString();
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

diaryEntries.push(new DiaryEntry(100518, 'Went to Unter party, met a lot of Germans', 8, 5, 1, "https://www.nytimes.com/2018/10/05/us/politics/brett-kavanaugh-vote-confirmed.html", "https://soundcloud.com/timsweeney/roiperez", "Spent time with best friends, met new people", ["dead lifts", "165lbs"], 5, "20min"));
diaryEntries.push(new DiaryEntry(100618, 'Ate bagels with Fabian and Ana in the park', 7, 5, 1, "https://www.nytimes.com/2018/10/06/us/politics/brett-kavanaugh-supreme-court.html", "https://open.spotify.com/track/3CsnKrOTZr1nIEGzFOQqyZ?si=vPe-RbCeQN2dEKyJ3w4e7w", "Spent time with best friends", ["none", "0"], 0, "0min"));
diaryEntries.push(new DiaryEntry(101018, 'Had a lot of pressure to figure out the vagus nerve', 4, 9, 7, "https://informationisbeautiful.net/visualizations/the-microbescope-infectious-diseases-in-context/", "https://open.spotify.com/track/21swDaVehYZMhdnMfMPB9p?si=J776Xu4VQ3m2QfTkW1lphA", "Connected with my OBGYN", ["none", "0"], 0, "20min"));



console.log(JSON.stringify(diaryEntries));


//part 3


var AWS = require('aws-sdk');
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-2";

/*var dynamodb = new AWS.DynamoDB();

var params = {};
for(let y=0; y<diaryEntries.length; y++){
params.Item = diaryEntries[y]; 
}

params.TableName = "deardiary";

dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack); // an error occurred
  else     console.log(data);   // successful response
}); */

var dynamodb = new AWS.DynamoDB();
let i = 0;

var params = {};
params.Item = diaryEntries[i]; 
params.TableName = "deardiary";
let delay = setTimeout(nextItem, 1000);
function nextItem(){
  dynamodb.putItem(params);
  params.Item = diaryEntries[i]; 
  params.TableName = "deardiary";
  i++;
}

  dynamodb.putItem(params, function (err, data) {
  if (err) console.log(err, err.stack,'error'); // an error occurred
  else     console.log(data,'data');           // successful response
});
