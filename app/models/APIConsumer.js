var request = require('request');

var g_wikiEndpoint = "https://en.wikipedia.org/w/api.php";
var g_parameters = [
    "titles=CNN",
    "rvstart=2019-03-01T10:00:00Z",
    "rvdir=newer",
    "action=query",
    "prop=revisions",
    "rvlimit=500",
    "rvprop=ids|flags|user|userid|timestamp|size|sha1|parsedcomment",
    "formatversion=2",
    "format=json"
]

module.exports.pull_data_from_API = async (strTitleName, strTimeStamp) =>
{
	g_parameters[0] = "titles=" + strTitleName;
	g_parameters[1] = "rvstart=" + strTimeStamp;
	var url = g_wikiEndpoint + "?" + g_parameters.join("&");
	//console.log("url: " + url);
	
	var options = {
		    url: url,
		    method: 'GET',
		    headers: {
		        'Accept': 'application/json',
		        'Accept-Charset': 'utf-8'
		    }
		};
	
	const p = new Promise((resolve, reject) => {
		request(options, function (err, res, data){
		    if (err) {
		        console.log('Error:', err);
		    } else if (res.statusCode !== 200) {
		        console.log('Error status code:', res.statusCode);
		    } else {
		        var json = JSON.parse(data);
		        var pages = json.query.pages;	        
		        let revisions = pages[Object.keys(pages)[0]].revisions;
		        		    
		        //console.log("pages:\n" + JSON.stringify(pages));
		        		        
		        resolve(revisions);
		    }
		})});		
		return p;
}









