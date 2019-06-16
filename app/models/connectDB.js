const mongoose = require("mongoose");

//mongoose.connect('mongodb://localhost/wikipedia', { useNewUrlParser: true }, function(){
//    console.log('mongodb connected')
//});

mongoose.connect('mongodb://briskwikipedia:3201@ec2-3-212-186-203.compute-1.amazonaws.com:27017/wikipedia', { useNewUrlParser: true }, function(){
    console.log('mongodb connected')
});

//mongodb://todoAholic:scotchio@ec2-52-0-14-185.compute-1.amazonaws.com:27017/dummyDB

module.exports = mongoose;