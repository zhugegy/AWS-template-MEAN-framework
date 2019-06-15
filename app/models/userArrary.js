const fs = require('fs');

const path = require("path");
const readline = require("readline");


// create arrays to store different types of users
// easy to query
var admin_active = new Array();
var admin_former = new Array();
var admin_inactive = new Array();
var admin_semi_active = new Array();
var bot = new Array();


console.log(__dirname);


var dir = __dirname + "/usertype/";


function readfile(filename){
    var fRead = fs.createReadStream(dir+filename+".txt");
    var array = new Array();
    var objReadline = readline.createInterface({
        input: fRead,
    });
    objReadline.on('line', (line)=> {

        array.push(line.toString());


    });
    objReadline.on("close", function(){
        // 结束程序
        process.exit(0);
    });
    return array;
}

var a = readfile("admin_active");
//readfile("admin_former",admin_former);
//readfile("admin_inactive",admin_inactive);
//readfile("admin_semi_active",admin_semi_active);
//readfile("bot",bot);
console.log("user array created!");


module.exports={

    admin_active:a


}
console.log(a);


function readFileToArray(filename,array) {
    //var filename = "../../Dataset_25_March_2019/"+filename+".txt";
	var filename = dir + filename+".txt";
    

    var fd = fs.openSync(filename, 'r');
    var bufferSize = 30720;
    var buffer = new Buffer.alloc(bufferSize);
    var leftOver = '';
    var read, line, idxStart, idx;
    var i =1;
    while ((read = fs.readSync(fd, buffer, 0, bufferSize, null)) !== 0) {
        leftOver += buffer.toString('utf8', 0, read);
        idxStart = 0;
        while ((idx = leftOver.indexOf("\r\n", idxStart)) !== -1) {
            line = leftOver.substring(idxStart, idx);
            array.push(line);
            idxStart = idx+2;
        }
        leftOver = leftOver.substring(idxStart);
        array.push(leftOver);

    }

}


readFileToArray("admin_active",admin_active);
readFileToArray("admin_former",admin_former);
readFileToArray("admin_inactive",admin_inactive);
readFileToArray("admin_semi_active",admin_semi_active);
readFileToArray("bot",bot);

console.log(admin_active);

console.log("hee");

exports.admin_active=admin_active;
exports.admin_former=admin_former;
exports.admin_inactive=admin_inactive;
exports.admin_semi_active=admin_semi_active;
exports.bot=bot;