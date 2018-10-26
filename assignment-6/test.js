var fs = require('fs');


function format(n) {
    return (n < 10) ? ("0" + n) : n;
}

for(var f=1;f<2;f++){
    
    var file = format(f);
    var json = fs.readFileSync("aadata/parsed_data/parsed_m0" + f + ".json");
    var data = JSON.parse(json);
    
    var result = [];
    
    for(var i=0;i<data.length;i++){
        
        var day;
        var start;
        var end;
        var name;
        var location;
        var address;
        var lat;
        var long;
        var region;
        var type;
        var interest;
        var entry = data[i];
    
        monday(i);
        tuesday(i);
        wednesday(i);
        thursday(i);
        friday(i);
        saturday(i);
        sunday(i);
        
        result.push({
            day: day,
            start:start,
            end: end,
            name: name,
            location: location,
            address: address,
            lat: lat,
            long: long,
            region: region,
            type: type,
            interest:interest
        });
    }
    
    result = JSON.stringify(result);
    fs.writeFile("data/sql_m"+file+".json", result, 'utf8')
    
}


function monday(i){
    var monday = data[i]['meeting_times']['Monday'];
    var test = monday.length>0;
    if(test === true){
        for(var j=0;j<monday.length;j++){
            day = "Monday";
            start = monday[j]['start'];
            end = monday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(monday[j]['details']['topic']!=undefined){
                type = monday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(monday[j]['details']['interest']!=undefined){
                interest = monday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
       
    };
}

function tuesday(i){
    var tuesday = data[i]['meeting_times']['Tuesday'];
    var test = tuesday.length>0;
    if(test === true){
        for(var j=0;j<tuesday.length;j++){
            day = "Tuesday";
            start = tuesday[j]['start'];
            end = tuesday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(tuesday[j]['details']['topic']!=undefined){
                type = tuesday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(tuesday[j]['details']['interest']!=undefined){
                interest = tuesday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
        // do nothing
    };
}

function wednesday(i){
    var wednesday = data[i]['meeting_times']['Wednesday'];
    var test = wednesday.length>0;
    if(test === true){
        for(var j=0;j<wednesday.length;j++){
            day = "Wednesday";
            start = wednesday[j]['start'];
            end = wednesday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(wednesday[j]['details']['topic']!=undefined){
                type = wednesday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(wednesday[j]['details']['interest']!=undefined){
                interest = wednesday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
        // do nothing
    };
}

function thursday(i){
    var thursday = data[i]['meeting_times']['Thursday'];
    var test = thursday.length>0;
    if(test === true){
        for(var j=0;j<thursday.length;j++){
            day = "Thursday";
            start = thursday[j]['start'];
            end = thursday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(thursday[j]['details']['topic']!=undefined){
                type = thursday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(thursday[j]['details']['interest']!=undefined){
                interest = thursday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
        // do nothing
    };
}

function friday(i){
    var friday = data[i]['meeting_times']['Friday'];
    var test = friday.length>0;
    if(test === true){
        for(var j=0;j<friday.length;j++){
            day = "Friday";
            start = friday[j]['start'];
            end = friday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(friday[j]['details']['topic']!=undefined){
                type = friday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(friday[j]['details']['interest']!=undefined){
                interest = friday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
        // do nothing
    };
}

function saturday(i){
    var saturday = data[i]['meeting_times']['Saturday'];
    var test = saturday.length>0;
    if(test === true){
        for(var j=0;j<saturday.length;j++){
            day = "Saturday";
            start = saturday[j]['start'];
            end = saturday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(saturday[j]['details']['topic']!=undefined){
                type = saturday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(saturday[j]['details']['interest']!=undefined){
                interest = saturday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
        // do nothing
    };
}

function sunday(i){
    var sunday = data[i]['meeting_times']['Sunday'];
    var test = sunday.length>0;
    if(test === true){
        for(var j=0;j<sunday.length;j++){
            day = "Sunday";
            start = sunday[j]['start'];
            end = sunday[j]['end'];
            name = entry['meeting_name'];
            location = entry['location_name'];
            address = entry['meeting_address'];
            lat = entry['latlong']['lat'];
            long = entry['latlong']['lng'];
            region = file;
            if(sunday[j]['details']['topic']!=undefined){
                type = sunday[j]['details']['topic'];
            } else {
                type = "undefined";
            };
            if(sunday[j]['details']['interest']!=undefined){
                interest = sunday[j]['details']['interest'];
            } else {
                interest = "undefined";
            }
        };
    } else {
        // do nothing
    };
}
