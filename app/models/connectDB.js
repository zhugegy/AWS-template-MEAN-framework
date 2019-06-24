const mongoose = require("mongoose");
var fs = require('fs');
var path = require("path");

//mongoose.connect('mongodb://localhost/wikipedia', { useNewUrlParser: true }, function(){
//    console.log('mongodb connected')
//});

// file reading for credentials
var g_strWikipediaCollectionUser = fs.readFileSync(path.join(path.resolve("public"), "credentials/WikipediaCollectionUser.txt"), 'utf8').toString().trim();
var g_strWikipediaCollectionPassword = fs.readFileSync(path.join(path.resolve("public"), "credentials/WikipediaCollectionPassword.txt"), 'utf8').toString().trim();
var g_strWikipediaCollectionIPAddress = fs.readFileSync(path.join(path.resolve("public"), "credentials/WikipediaCollectionIPAddress.txt"), 'utf8').toString().trim();

mongoose.connect('mongodb://' +
    g_strWikipediaCollectionUser + ':' +
    g_strWikipediaCollectionPassword +
    '@' +
    g_strWikipediaCollectionIPAddress, { useNewUrlParser: true }, function(){
    console.log('mongodb connected')
});

module.exports = mongoose;