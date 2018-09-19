// npm install cheerio

var fs = require('fs');
var cheerio = require('cheerio');

// load the AA text file into a variable, `content`
var content = fs.readFileSync('/home/ec2-user/environment/data/week1/m06.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// make array of addresses in AA text file
// take out whitespace, push to array
var x = new Array;

$('tr').each(function(i, elem) {
     let address = $(elem).children('td').first().children().remove('b').remove('h4').remove('div').remove('span').remove('img').parent().text();
     address = address.replace(/\s\s+/g, ' ');
     x.push(address);
});

// take out unecessary elements in array
x.splice(0,4);
x.splice(-1,1);

// log array of addresses to console
console.log(x);

// save array to file
fs.writeFile('/home/ec2-user/environment/data/week2/address.txt', x,(data)=>{
console.log('done');
});
