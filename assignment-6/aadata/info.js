var fs = require('fs');
var cheerio = require('cheerio');

// load the AA text file into a variable, `content`
//var content = fs.readFileSync('/home/ec2-user/environment/data/aadata/data/m06.txt');

// load `content` into a cheerio object
//var $ = cheerio.load(content);

for (var x = 1; x < 10; x++){
    var file = x;
    var content = fs.readFileSync('data/m0' + file + '.txt');
    var $ = cheerio.load(content);
    var save_path = 'info/info_m0' + file + '.json';
    var dict = [];

$('td').each(function(i,elem) {
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3;width:350px;") {
        let info = $(elem).children().parent().text();
        info = info.replace(/\s\s+/g, ' ');
        dict.push(info);
        console.log(dict);
        }
    })
    dict = JSON.stringify(dict);
        fs.writeFile(save_path, dict, 'utf8');

    
};

var x = 10;

var file = x;
    var content = fs.readFileSync('data/m' + file + '.txt');
    var $ = cheerio.load(content);
    var save_path = 'info/info_m' + file + '.json';
    var dict = [];

$('td').each(function(i,elem) {
    if ($(elem).attr("style")=="border-bottom:1px solid #e3e3e3;width:350px;") {
        let info = $(elem).children().parent().text();
        info = info.replace(/\s\s+/g, ' ');
        dict.push(info);
        console.log(dict);
        }
    })
    dict = JSON.stringify(dict);
        fs.writeFile(save_path, dict, 'utf8');
