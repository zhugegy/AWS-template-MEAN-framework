const mongoose = require("mongoose");
var fs = require('fs');
var path = require("path");

//mongoose.connect('mongodb://localhost/wikipedia', { useNewUrlParser: true }, function(){
//    console.log('mongodb connected')
//});

// file reading for credentials
var g_strWikipediaCollectionCredential = fs.readFileSync(path.join(path.resolve("public"), "credentials/WikipediaCollectionCredentialDetails.txt"), 'utf8').toString().split("\n");

mongoose.connect('mongodb://' +
    g_strWikipediaCollectionCredential[1].trim() + ':' +
    g_strWikipediaCollectionCredential[2].trim() +
    '@' +
    g_strWikipediaCollectionCredential[0].trim(), { useNewUrlParser: true }, function(){
    console.log('mongodb connected')
});

module.exports = mongoose;