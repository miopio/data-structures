var fs = require('fs');
var cheerio = require('cheerio');

var toTitleCase = function (str) {
	str = str.toLowerCase().split(' ');
	for (var i = 0; i < str.length; i++) {
		str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
	}
	return str.join(' ');
};

function format(n) {
    return (n < 10) ? ("0" + n) : n;
}

for(var i=1;i<11;i++){
    
    var file = format(i);
    var content = fs.readFileSync('data/m' + file + '.txt');
    var $ = cheerio.load(content);
    var table = $('table').eq(2);
    var cell = table.find($('td'));
    var save_path = 'parsed_data/parsed_m' + file + '.json';
    var dict = [];
    var constant = 0;
    var constant_2 = 0;
    cell.each(function(i,elem){
       var value = i;
        
        // get needed info from left-hand side cells
        if(i%3 === 0 | i===0 ){
            var id = constant++;
            var location_name = $('h4',elem).text();
            var meeting_name = $(elem).children().eq(2).text().trim().toString();
            var meeting_address = $(elem).contents().filter(function() {
                    return this.type === 'text';
                }).text().trim();
            meeting_address = meeting_address.split(",")[0];
            meeting_name = toTitleCase(meeting_name)
            meeting_name= meeting_name.replace("-", "");
            meeting_name = meeting_name.trim();
            dict.push({
                    id: id,
    				meeting_name: meeting_name,
    				location_name: location_name,
    				meeting_address: meeting_address,
    			});
        } 
        
        // get needed info from middle cells
        var middle_cells = [1];
        var middle_start = 1;
        for (i=0;i<100;i++){
            middle_start = middle_start+3;
            middle_cells.push(middle_start);
        }
        var test = middle_cells.includes(value);
        
       if (test === true){
           var id = constant_2++;
            var content = $(elem).contents().map(function() {
                if (this.type === 'text' | this.nodeType == 1)
                    return $(this).text().trim()
            }).get();
            //console.log(content);
           var details = Array.from(content);
           //console.log(details);
            // search for what you need in the array, find the index of it, 
            // and add to find the position of information to return
            
            var monday_indices = [];
            var monday_index = details.indexOf('Mondays From');
            while (monday_index != -1){
                monday_indices.push(monday_index);
                monday_index = details.indexOf('Mondays From', monday_index + 1);
            }
            //console.log(monday_index);
            
            var monday_start = [];
            var monday_end = [];
            var monday_topic = [];
            var monday_interests = [];
            
            //for however many "Mondays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < monday_indices.length; j++ ){
                monday_index = monday_indices[j];
                if(monday_index!= -1) {
                    monday_start[j] = details[monday_index+1];
                    monday_end[j] = details[monday_index+3];
                if(details[monday_index+5].match(/Type|Special/gi)){
                    if(details[monday_index+5].match(/Type/gi)){
                        monday_topic[j]=details[monday_index+6];
                    } else {
                        monday_interests[j]=details[monday_index+6];
                    }
                }
                if(details[monday_index+8].match(/Special/gi)){
                    monday_interests[j]=details[monday_index+9];
                }
            };
                
            }

            var tuesday_indices = [];
            var tuesday_index = details.indexOf('Tuesdays From');
            while (tuesday_index != -1){
                tuesday_indices.push(tuesday_index);
                tuesday_index = details.indexOf('Tuesdays From', tuesday_index + 1);
            }
            
            var tuesday_start = [];
            var tuesday_end = [];
            var tuesday_topic = [];
            var tuesday_interests = [];
            
            //for however many "Tuesdays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < tuesday_indices.length; j++ ){
                tuesday_index = tuesday_indices[j];
                if(tuesday_index!= -1) {
                    tuesday_start[j] = details[tuesday_index+1];
                    tuesday_end[j] = details[tuesday_index+3];
                if(details[tuesday_index+5].match(/Type|Special/gi)){
                    if(details[tuesday_index+5].match(/Type/gi)){
                        tuesday_topic[j]=details[tuesday_index+6];
                    } else {
                        tuesday_interests[j]=details[tuesday_index+6];
                    }
                }
                if(details[tuesday_index+8]!=undefined){
                    if (details[tuesday_index+8].match(/Special/gi)){
                    tuesday_interests[j]=details[tuesday_index+9];
                    }
                }
            };
                
            }   

            var wednesday_indices = [];
            var wednesday_index = details.indexOf('Wednesdays From');
            while (wednesday_index != -1){
                wednesday_indices.push(wednesday_index);
                wednesday_index = details.indexOf('Wednesdays From', wednesday_index + 1);
            }
            
            var wednesday_start = [];
            var wednesday_end = [];
            var wednesday_topic = [];
            var wednesday_interests = [];
            
            //for however many "Wednesdays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < wednesday_indices.length; j++ ){
                wednesday_index = wednesday_indices[j];
                if(wednesday_index!= -1) {
                    wednesday_start[j] = details[wednesday_index+1];
                    wednesday_end[j] = details[wednesday_index+3];
                if(details[wednesday_index+5].match(/Type|Special/gi)){
                    if(details[wednesday_index+5].match(/Type/gi)){
                        wednesday_topic[j]=details[wednesday_index+6];
                    } else {
                        wednesday_interests[j]=details[wednesday_index+6];
                    }
                }
                if(details[wednesday_index+8].match(/Special/gi)){
                    wednesday_interests[j]=details[wednesday_index+9];
                }
            };
                
            }
            
            var thursday_indices = [];
            var thursday_index = details.indexOf('Thursdays From');
            while (thursday_index != -1){
                thursday_indices.push(thursday_index);
                thursday_index = details.indexOf('Thursdays From', thursday_index + 1);
            }
            
            var thursday_start = [];
            var thursday_end = [];
            var thursday_topic = [];
            var thursday_interests = [];
            
            //for however many "Thursdays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < thursday_indices.length; j++ ){
                thursday_index = thursday_indices[j];
                if(thursday_index!= -1) {
                    thursday_start[j] = details[thursday_index+1];
                    thursday_end[j] = details[thursday_index+3];
                if(details[thursday_index+5].match(/Type|Special/gi)){
                    if(details[thursday_index+5].match(/Type/gi)){
                        thursday_topic[j]=details[thursday_index+6];
                    } else {
                        thursday_interests[j]=details[thursday_index+6];
                    }
                }
                if(details[thursday_index+8].match(/Special/gi)){
                    thursday_interests[j]=details[thursday_index+9];
                }
            };
                
            }

            var friday_indices = [];
            var friday_index = details.indexOf('Fridays From');
            while (friday_index != -1){
                friday_indices.push(friday_index);
                friday_index = details.indexOf('Fridays From', friday_index + 1);
            }
            
            var friday_start = [];
            var friday_end = [];
            var friday_topic = [];
            var friday_interests = [];
            
            //for however many "Fridays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < friday_indices.length; j++ ){
                friday_index = friday_indices[j];
                if(friday_index!= -1) {
                    friday_start[j] = details[friday_index+1];
                    friday_end[j] = details[friday_index+3];
                if(details[friday_index+5].match(/Type|Special/gi)){
                    if(details[friday_index+5].match(/Type/gi)){
                        friday_topic[j]=details[friday_index+6];
                    } else {
                        friday_interests[j]=details[friday_index+6];
                    }
                }
                if(details[friday_index+8].match(/Special/gi)){
                    friday_interests[j]=details[friday_index+9];
                }
            };
                
            }  
 
            var saturday_indices = [];
            var saturday_index = details.indexOf('Saturdays From');
            while (saturday_index != -1){
                saturday_indices.push(saturday_index);
                saturday_index = details.indexOf('Saturdays From', saturday_index + 1);
            }
            
            var saturday_start = [];
            var saturday_end = [];
            var saturday_topic = [];
            var saturday_interests = [];
            
            //for however many "Saturdays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < saturday_indices.length; j++ ){
                saturday_index = saturday_indices[j];
                if(saturday_index!= -1) {
                    saturday_start[j] = details[saturday_index+1];
                    saturday_end[j] = details[saturday_index+3];
                if(details[saturday_index+5].match(/Type|Special/gi)){
                    if(details[saturday_index+5].match(/Type/gi)){
                        saturday_topic[j]=details[saturday_index+6];
                    } else {
                        saturday_interests[j]=details[saturday_index+6];
                    }
                }
                if(details[saturday_index+8].match(/Special/gi)){
                    saturday_interests[j]=details[saturday_index+9];
                }
            };
                
            }            
            
            var sunday_indices = [];
            var sunday_index = details.indexOf('Sundays From');
            while (sunday_index != -1){
                sunday_indices.push(sunday_index);
                sunday_index = details.indexOf('Sundays From', sunday_index + 1);
            }
            
            var sunday_start = [];
            var sunday_end = [];
            var sunday_topic = [];
            var sunday_interests = [];
            
            //for however many "sundays from" there are, go in and get an array for start time, end time etc.
            for (var j = 0; j < sunday_indices.length; j++ ){
                sunday_index = sunday_indices[j];
                if(sunday_index!= -1) {
                    sunday_start[j] = details[sunday_index+1];
                    sunday_end[j] = details[sunday_index+3];
                if(details[sunday_index+5].match(/Type|Special/gi)){
                    if(details[sunday_index+5].match(/Type/gi)){
                        sunday_topic[j]=details[sunday_index+6];
                    } else {
                        sunday_interests[j]=details[sunday_index+6];
                    }
                }
                if(details[sunday_index+8].match(/Special/gi)){
                    sunday_interests[j]=details[sunday_index+9];
                }
            };
                
            } 
            
            //make an array with all Monday meeting times, print to console
            var monday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < monday_indices.length; k++) {
                monday_meeting_times.push({
                    start:monday_start[k],
                    end: monday_end[k],
                    details: {
                        topic: monday_topic[k],
                        interest: monday_interests[k] 
                    }
                });
            }
            // console.log(monday_meeting_times);

            //make an array with all Tuesday meeting times, print to console
            var tuesday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < tuesday_indices.length; k++) {
                tuesday_meeting_times.push({
                    start:tuesday_start[k],
                    end: tuesday_end[k],
                    details: {
                        topic: tuesday_topic[k],
                        interest: tuesday_interests[k] 
                    }
                });
            }
            // console.log(tuesday_meeting_times);

            //make an array with all Wednesday meeting times, print to console
            var wednesday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < wednesday_indices.length; k++) {
                wednesday_meeting_times.push({
                    start:wednesday_start[k],
                    end: wednesday_end[k],
                    details: {
                        topic: wednesday_topic[k],
                        interest: wednesday_interests[k] 
                    }
                });
            }
            // console.log(wednesday_meeting_times);

            //make an array with all Thursday meeting times, print to console
            var thursday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < thursday_indices.length; k++) {
                thursday_meeting_times.push({
                    start:thursday_start[k],
                    end: thursday_end[k],
                    details: {
                        topic: thursday_topic[k],
                        interest: thursday_interests[k] 
                    }
                });
            }
            // console.log(thursday_meeting_times);      
            
            //make an array with all Friday meeting times, print to console
            var friday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < friday_indices.length; k++) {
                friday_meeting_times.push({
                    start:friday_start[k],
                    end: friday_end[k],
                    details: {
                        topic: friday_topic[k],
                        interest: friday_interests[k] 
                    }
                });
            }
            // console.log(friday_meeting_times);   
        
             //make an array with all Friday meeting times, print to console
            var saturday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < saturday_indices.length; k++) {
                saturday_meeting_times.push({
                    start:saturday_start[k],
                    end: saturday_end[k],
                    details: {
                        topic: saturday_topic[k],
                        interest: saturday_interests[k] 
                    }
                });
            }
            // console.log(saturday_meeting_times);   

            //make an array with all Sunday meeting times, print to console
            var sunday_meeting_times = new Array;
            // create a new key value pair for each monday listing
            for (var k=0; k < sunday_indices.length; k++) {
                sunday_meeting_times.push({
                    start:sunday_start[k],
                    end: sunday_end[k],
                    details: {
                        topic: sunday_topic[k],
                        interest: sunday_interests[k] 
                    }
                });
            }
            // console.log(sunday_meeting_times);   
        
        
        
        
        //how to put in these times corresponding to id?
        //for (var k=0; k<monday_indices.length; k++) {
            dict[id].meeting_times = {
                    Monday: monday_meeting_times,
                    Tuesday: tuesday_meeting_times,
                    Wednesday: wednesday_meeting_times,
                    Thursday: thursday_meeting_times,
                    Friday: friday_meeting_times,
                    Saturday: saturday_meeting_times,
                    Sunday: sunday_meeting_times
                }
        }
    })
    
    dict = JSON.stringify(dict);
    fs.writeFile(save_path, dict, 'utf8')
    
}