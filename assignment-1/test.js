var request = require('request');
var fs = require('fs');


//change number at the end of URL and text file for every number 01-10
// I know there is more succinct way to do this, but didn't have knowledge to
request('https://parsons.nyc/aa/m01.html', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/testproject/test1.txt', body);
    }
    else {console.log("Request failed!")}
});
