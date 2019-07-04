var request = require('request');
var ModelOperationsWIA = require("../models/individualAnalytics")

var g_wikiEndpoint = "https://en.wikipedia.org/w/api.php";
var g_parameters = [
    "titles=CNN",
    "rvstart=2001-01-01T10:00:00Z",
    "rvdir=newer",
    "action=query",
    "prop=revisions",
    "rvlimit=500",
    "rvprop=ids|flags|user|userid|timestamp|size|sha1|parsedcomment",
    "formatversion=2",
    "format=json"
]

module.exports.pull_data_from_API = async (strTitleName, strTimeStamp, strRvLimit) =>
{
	g_parameters[0] = "titles=" + strTitleName;
	if (strTimeStamp != "Reserved")
	{
		if (strTimeStamp == "Latest")
		{
			let objTmp = await ModelOperationsWIA.individual_article_find_latest_timeAsync(strTitleName);
			g_parameters[1] = "rvstart=" + objTmp.last_timestamp;
		}
		else
		{
			g_parameters[1] = "rvstart=" + strTimeStamp;
		}
	}
	else
	{
		g_parameters[1] = "rvstart=2001-01-01T10:00:00Z";
	}

	if (strRvLimit != "Reserved")
	{
		g_parameters[5] = "rvlimit=" + strRvLimit;
	}
	else
	{
		g_parameters[5] = "rvlimit=500";
	}

	var url = g_wikiEndpoint + "?" + g_parameters.join("&");

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
			} else if (res.statusCode != 200) {
				console.log('Error status code:', res.statusCode);
			} else {
				var json = JSON.parse(data);
				var pages = json.query.pages;
				let revisions = pages[Object.keys(pages)[0]].revisions;

				resolve(revisions);
			}
		})});
	return p;
}