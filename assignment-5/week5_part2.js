var diaryEntries = [];

class DiaryEntry {
  constructor(pkDate, blurb, happiness, stress, productivity, currentEvents, music, interaction, exercise, alcohol, meditation) {
    this.pkDate = {};
    this.pkDate.N = pkDate.toString();
    this.blurb = {};
    this.blurb.S = blurb;
    this.happiness = {};
    this.happiness.N = happiness.toString();
    this.stress = {};
    this.stress.N = stress.toString();
    this.productivity = {};
    this.productivity = productivity.toString();
    this.currentEvents = {};
    this.currentEvents.S = currentEvents;
    this.music = {};
    this.music.S = music;
    this.interaction = {};
    this.interaction.S = {};
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
    
    //this.month = {};
    //this.month.N = new Date(date).getMonth().toString();
  }
}

diaryEntries.push(new DiaryEntry(100518, 'Went to Unter party, met a lot of Germans', 8, 5, 1, "https://www.nytimes.com/2018/10/05/us/politics/brett-kavanaugh-vote-confirmed.html", "https://soundcloud.com/timsweeney/roiperez", "Spent time with best friends, met new people", ["dead lifts", "165lbs"], 5, "20min"));
diaryEntries.push(new DiaryEntry(100618, 'Ate bagels with Fabian and Ana in the park', 7, 5, 1, "https://www.nytimes.com/2018/10/06/us/politics/brett-kavanaugh-supreme-court.html", "https://open.spotify.com/track/3CsnKrOTZr1nIEGzFOQqyZ?si=vPe-RbCeQN2dEKyJ3w4e7w", "Spent time with best friends", ["none", "0"], 0, "0min"));
diaryEntries.push(new DiaryEntry(101018, 'Had a lot of pressure to figure out the vagus nerve', 4, 9, 7, "https://informationisbeautiful.net/visualizations/the-microbescope-infectious-diseases-in-context/", "https://open.spotify.com/track/21swDaVehYZMhdnMfMPB9p?si=J776Xu4VQ3m2QfTkW1lphA", "Connected with my OBGYN", ["none", "0"], 0, "20min"));

console.log(JSON.stringify(diaryEntries));
