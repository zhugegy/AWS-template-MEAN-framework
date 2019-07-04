var express = require('express');
var fs = require('fs');
var path = require("path");
var exec = require('child_process').exec;

//var ModelOperationsZ = require("../models/mongoDBZ")
//var ModelOperationsW = require("../models/mongoDBW")
var ModelOperationsWOA = require("../models/overallAnalytics")
var ModelOperationsWG = require("../models/graphsDataGet")
var ModelOperationsWIA = require("../models/individualAnalytics")
var ModelOperationsWAA = require("../models/authorAnalytics")
var APIOperationsZ = require("../models/APIConsumer")
var ModelOperationsWID = require("../models/insertData")
var ModelOperationsWUOD = require("../models/updateOverallData")

//var ModelOperationsWUA = require("../models/userArrary")

var g_ConstStrWikiPediaStartYear = "2001";

// file reading for performance operations
var g_constUserTypeDirName = "/usertype/";
var g_aryAdminActive = fs.readFileSync(__dirname + g_constUserTypeDirName + 'admin_active.txt','utf8').toString().split("\n");
var g_aryAdminFormer = fs.readFileSync(__dirname + g_constUserTypeDirName + 'admin_former.txt','utf8').toString().split("\n");
var g_aryAdminInactive = fs.readFileSync(__dirname + g_constUserTypeDirName + 'admin_inactive.txt','utf8').toString().split("\n");
var g_aryAdminSemiActive = fs.readFileSync(__dirname + g_constUserTypeDirName + 'admin_semi_active.txt','utf8').toString().split("\n");
var g_aryBot = fs.readFileSync(__dirname + g_constUserTypeDirName + 'bot.txt','utf8').toString().split("\n");


// file reading for credentials
var g_strThumbnailwsAPIKey = fs.readFileSync(path.join(path.resolve("public"), "credentials/ThumbnailwsAPIKey.txt"), 'utf8').toString().trim();
//console.log(g_strThumbnailwsAPIKey);

// ## Data manipulation

// Handler encapsulates all the MongoDB related functions.
var Handler={};

Handler.overall_analytics_get_n_titles_with_most_revisions = async (strRankNumber, req, res) => {
	//let objTmp = await ModelOperationsZ.overall_analytics_get_n_titles_with_most_revisions(strRankNumber);	
	let objTmp = await ModelOperationsWOA.overall_analytics_get_n_titles_with_most_revisionsAsync(strRankNumber);

	//check_screenshot(objTmp['title_lst']);

	res.json(objTmp);
}

function check_screenshot(lstObjArticles)
{
	var publicPath = path.resolve("public");

	for (var i = 0; i < lstObjArticles.length; i++)
	{
		var strPicPath = path.join(publicPath, "images/website_screenshot/" + lstObjArticles[i] + ".jpeg");

		fs.stat(strPicPath, function(err, stats)
		{
			if (stats == null)
			{
				//console.log(err.path);
				var nIndexStart = err.path.lastIndexOf("/") + 1;
				var nIndexEnd = err.path.lastIndexOf(".jpeg");
				var strTitleName = err.path.slice(nIndexStart, nIndexEnd);
				var strTitleNameProcessed = strTitleName.replace(/ /g, "%5F");
				//console.log(strTitleNameProcessed);

				var strTmp = "curl \"https://api.thumbnail.ws/api/" +
					g_strThumbnailwsAPIKey +
					"/thumbnail/get?url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2F" +
					strTitleNameProcessed + "&width=640\" > " + "\"" + err.path + "\"" +
					" && " +
					"convert " + "\"" + err.path + "\"" + " -crop 545x345+95+15 " + "\"" + err.path + "\"";

				// "echo ab > " + "\"" + err.path.replace(".jpeg", ".txt") + "\""

				var child = exec(strTmp,
					(error, stdout, stderr) =>
					{
						if (error !== null)
						{
							console.log(`exec error: ${error}`);
						}
					});
			}
		});

	}
}

Handler.overall_analytics_get_n_titles_with_least_revisions = async (strRankNumber, req, res) => {
	//let objTmp =  await ModelOperationsZ.overall_analytics_get_n_titles_with_most_revisions(strRankNumber);
	let objTmp =  await ModelOperationsWOA.overall_analytics_get_n_titles_with_least_revisionsAsync(strRankNumber);
	res.json(objTmp);
}

Handler.overall_analytics_get_title_with_most_unique_users = async (req, res) => {
	//let objTmp = await ModelOperationsZ.overall_analytics_get_title_with_most_unique_users();
	let objTmp = await ModelOperationsWOA.overall_analytics_get_title_with_most_unique_usersAsync();
	res.json(objTmp);
}

Handler.overall_analytics_get_title_with_least_unique_users = async (req, res) => {
	//let objTmp = await ModelOperationsZ.overall_analytics_get_title_with_least_unique_users();
	let objTmp = await ModelOperationsWOA.overall_analytics_get_title_with_least_unique_usersAsync();
	res.json(objTmp);
}

Handler.overall_analytics_top_two_title_with_longest_history = async (req, res) => {
	//let objTmp = await ModelOperationsZ.overall_analytics_top_two_title_with_longest_history();
	const objTmp = await ModelOperationsWOA.overall_analytics_top_two_title_with_longest_historyAsync();
	
	res.json(objTmp);
}

Handler.overall_analytics_title_with_shortest_history = async (req, res) => {
	//let objTmp = await ModelOperationsZ.overall_analytics_title_with_shortest_history();
	let objTmp = await ModelOperationsWOA.overall_analytics_top_two_title_with_shortest_historyAsync();
	res.json(objTmp);
}

//Handler.overall_analytics_get_drawsample = async (req, res) => {
//	let objTmp = await ModelOperationsZ.overall_analytics_get_drawsample();
//	res.json(objTmp);
//}

Handler.individual_article_analytics_get_entire_title_listAsyn = async (req, res) => {
	//let objTmp = await ModelOperationsZ.individual_article_analytics_get_entire_title_listAsyn();
	let objTmp = await ModelOperationsWOA.individual_article_analytics_get_entire_title_listAsync();
	res.json(objTmp);
}

Handler.individual_article_analytics_get_title_last_timestampAsy = async (strTitleName, req, res) => {
	//let objTmp = await ModelOperationsZ.individual_article_find_latest_timeAsync(strTitleName);
	let objTmp = await ModelOperationsWIA.individual_article_find_latest_timeAsync(strTitleName);
	res.json(objTmp);
}

Handler.individual_article_analytics_get_title_infoAsync = async (strTitleName, strStartYear, strEndYear, req, res) => {
	//let objTmp = await ModelOperationsZ.individual_article_analytics_get_title_infoAsync(strTitleName, strStartYear, strEndYear);
	let objTmp = await ModelOperationsWIA.individual_article_analytics_get_title_infoAsync(strTitleName, strStartYear, strEndYear);
	res.json(objTmp);
}

Handler.individual_article_analytics_get_title_contributing_infoAsync = async (strTitleName, strUserCount, strStartYear, strEndYear, req, res) => {
	//let objTmp = await ModelOperationsZ.individual_article_analytics_get_title_contributing_infoAsync(strTitleName, strUserCount, strStartYear, strEndYear);
	let objTmp = await ModelOperationsWIA.individual_article_analytics_get_title_contributing_infoAsync(strTitleName, strUserCount, strStartYear, strEndYear);
	res.json(objTmp);
}

Handler.author_analytics_get_author_infoAsyn = async (strTitleName, req, res) => {
	//let objTmp = await ModelOperationsZ.author_analytics_get_author_infoAsyn(strTitleName);
	let objTmp = await ModelOperationsWAA.author_analytics_get_author_infoAsync(strTitleName);
	res.json(objTmp);
}

Handler.author_analytics_get_author_with_article_infoAsyn = async (strAuthorName, strTitleName, req, res) => {
	//let objTmp = await ModelOperationsZ.author_analytics_get_author_with_article_infoAsyn(strAuthorName, strTitleName);
	let objTmp = await ModelOperationsWAA.author_analytics_get_author_with_article_infoAsync(strAuthorName, strTitleName);
	res.json(objTmp);
}

Handler.overall_analytics_get_user_distributionAsync = async (strYear, req, res) => {
	//let objTmp = await ModelOperationsZ.overall_analytics_get_user_distributionAsync(strYear);
	let objTmp = await ModelOperationsWG.overall_analytics_get_user_distributionAsync(strYear);
	res.json(objTmp);
}

Handler.individual_article_analytics_get_user_distribution_Async = async (strYear, strTitleName, req, res) => {
	let objTmp = await ModelOperationsWG.individual_article_analytics_get_user_distribution_Async(strYear, strTitleName);
	res.json(objTmp);
}

Handler.individual_article_analytics_get_user_distributionAsync = async (strYear, strUser, strTitleName, req, res) => {
	let objTmp = await ModelOperationsWG.individual_article_analytics_get_user_distributionAsync(strYear, strUser, strTitleName);
	res.json(objTmp);
}



//function __sleep(ms) {
//	  return new Promise(resolve => setTimeout(resolve, ms));
//	}
//
//async function __tmp_sleep() {
//  await __sleep(1000);
//}
//simulate querying (sleep)
//let a = await __tmp_sleep();

Handler.miscellaneous_fetch_data_from_wikipedia = async (strArticleName, strIsUpToDate, strLastTimeStamp, req, res) => {
	if (strIsUpToDate == "1")
	{
		let objTmpNoMeaning = {
			noMeaning: "hello"
		};

		res.json(objTmpNoMeaning);
	}

	if (strIsUpToDate == "0")
	{
		// call API
		let lstObjRevisons = await APIOperationsZ.pull_data_from_API(strArticleName, strLastTimeStamp, "Reserved");

		lstObjRevisons.splice(0, 1);  // remove the first one

		for (var i = 0; i < lstObjRevisons.length; i++)
		{
			lstObjRevisons[i].title = strArticleName;

			// determine user type
			if ('anon' in lstObjRevisons[i])
			{
				//console.log("anon happened!");
				lstObjRevisons[i].user_type = "anon";
			}
			else if ('user' in lstObjRevisons[i])
			{
				var strUserName = lstObjRevisons[i].user;
				if (g_aryAdminActive.includes(strUserName) == true)
				{
					lstObjRevisons[i].user_type = "admin_active";
				}
				else if (g_aryAdminFormer.includes(strUserName) == true)
				{
					lstObjRevisons[i].user_type = "admin_former";
				}
				else if (g_aryAdminInactive.includes(strUserName) == true)
				{
					lstObjRevisons[i].user_type = "admin_inactive";
				}
				else if (g_aryAdminSemiActive.includes(strUserName) == true)
				{
					lstObjRevisons[i].user_type = "admin_semi_active";
				}
				else if (g_aryBot.includes(strUserName) == true)
				{
					lstObjRevisons[i].user_type = "bot";
				}
				else
				{
					lstObjRevisons[i].user_type = "regular";
				}
			}
			else if ('userhidden' in lstObjRevisons[i])
			{
				//console.log("hidden happened!");
				lstObjRevisons[i].user_type = "hidden";
			}

			//console.log("usertype:" + lstObjRevisons[i].user_type);
		}

		// call into Model (write operation)
		if (lstObjRevisons.length > 0)
		{
			//1st not await
			ModelOperationsWID.insertRevisionsData(lstObjRevisons);
			//2nd await
			let tmp = await ModelOperationsWUOD.checkOverallInfo();
		}

		//console.log(ModelOperationsWUA.admin_inactive);


		let objTmp =
			{
				revisions_updated: lstObjRevisons.length
			}

		res.json(objTmp);
	}
}

Handler.miscellaneous_trying_fetch_first_data_from_wikipedia = async (strArticleName, req, res) => {
	// call API
	let lstObjRevisons = await APIOperationsZ.pull_data_from_API(strArticleName, "Reserved", "1");

	if (lstObjRevisons == null)
	{
		let objTmp =
			{
				revisions_updated: -1
			}

		res.json(objTmp);
		return;
	}

	for (var i = 0; i < lstObjRevisons.length; i++)
	{
		lstObjRevisons[i].title = strArticleName;

		// determine user type
		if ('anon' in lstObjRevisons[i])
		{
			//console.log("anon happened!");
			lstObjRevisons[i].user_type = "anon";
		}
		else if ('user' in lstObjRevisons[i])
		{
			var strUserName = lstObjRevisons[i].user;
			if (g_aryAdminActive.includes(strUserName) == true)
			{
				lstObjRevisons[i].user_type = "admin_active";
			}
			else if (g_aryAdminFormer.includes(strUserName) == true)
			{
				lstObjRevisons[i].user_type = "admin_former";
			}
			else if (g_aryAdminInactive.includes(strUserName) == true)
			{
				lstObjRevisons[i].user_type = "admin_inactive";
			}
			else if (g_aryAdminSemiActive.includes(strUserName) == true)
			{
				lstObjRevisons[i].user_type = "admin_semi_active";
			}
			else if (g_aryBot.includes(strUserName) == true)
			{
				lstObjRevisons[i].user_type = "bot";
			}
			else
			{
				lstObjRevisons[i].user_type = "regular";
			}
		}
		else if ('userhidden' in lstObjRevisons[i])
		{
			//console.log("hidden happened!");
			lstObjRevisons[i].user_type = "hidden";
		}

		//console.log("usertype:" + lstObjRevisons[i].user_type);
	}

	// call into Model (write operation)
	if (lstObjRevisons.length > 0)
	{
		//1st not await
		ModelOperationsWID.insertRevisionsData(lstObjRevisons);
		//2nd await
		let tmp = await ModelOperationsWUOD.checkOverallInfo();
	}

	//console.log(ModelOperationsWUA.admin_inactive);
	let objTmp =
		{
			revisions_updated: lstObjRevisons.length
		}

	check_screenshot([strArticleName]);

	res.json(objTmp);
}


Handler.miscellaneous_get_session_user_stauts = async (req, res) => {
	sess = req.session;
	let objMetaDataTmp = construct_landing_page_meta_data(sess);
	strCurrentUserStatus = objMetaDataTmp["user_status"];
	
	let objTmp = {
	user_status: strCurrentUserStatus
	};
	
	res.json(objTmp);
}

Handler.miscellaneous_get_session_tab_name = async (req, res) => {
	sess = req.session;
	let objMetaDataTmp = construct_landing_page_meta_data(sess);
	strCurrentTabName = objMetaDataTmp["tab_name"];

	let objTmp = {
		tab_name: strCurrentTabName
	};

	res.json(objTmp);
}

Handler.miscellaneous_change_session_tab_name = async (strTabName, req, res) => {
	sess = req.session;
	sess["tab_name"] = strTabName;

	let objTmp = {
		void: "void"
	};

	res.json(objTmp);
}

Handler.miscellaneous_get_session_user_identification = async (req, res) => {
	sess = req.session;
	let objMetaDataTmp = construct_landing_page_meta_data(sess);
	strCurrentUserIdentification = objMetaDataTmp["user_identification"];
	
	let objTmp = {
	user_identification: strCurrentUserIdentification
	};
	
	res.json(objTmp);
}

// data tunnel between client and server.
// abandoned. Not Async.
module.exports.__constructData = function(req, res)
{	
	var nParamNum = req.query.paramNum;
//	console.log("function being called: " + req.query.FunId);
//	console.log("parameter number: " + nParamNum.toString());
	
	if (nParamNum == 0)
	{
		res.json(Handler[req.query.FunId](req, res));
	}
	else if (nParamNum == 1)
	{
		res.json(Handler[req.query.FunId](req.query.Param1, req, res));
	}
	else if (nParamNum == 2)
	{
		res.json(Handler[req.query.FunId](req.query.Param1, req.query.Param2, req, res));
	}
	else if (nParamNum == 3)
	{
		res.json(Handler[req.query.FunId](req.query.Param1, req.query.Param2, req.query.Param3, req, res));
	}
	else if (nParamNum == 4)
	{
		res.json(Handler[req.query.FunId](req.query.Param1, req.query.Param2, req.query.Param3, req.query.Param4, req, res));
	}
	
};

//data tunnel between client and server.
module.exports.constructData = async (req, res) => {	
	var nParamNum = req.query.paramNum;
	
	if (nParamNum == 0)
	{
		Handler[req.query.FunId](req, res);
	}
	else if (nParamNum == 1)
	{
		Handler[req.query.FunId](req.query.Param1, req, res);
	}
	else if (nParamNum == 2)
	{
		Handler[req.query.FunId](req.query.Param1, req.query.Param2, req, res);
	}
	else if (nParamNum == 3)
	{
		Handler[req.query.FunId](req.query.Param1, req.query.Param2, req.query.Param3, req, res);
	}
	else if (nParamNum == 4)
	{
		Handler[req.query.FunId](req.query.Param1, req.query.Param2, req.query.Param3, req.query.Param4, req, res);
	}
	
};


// ## (exported) views

module.exports.showLanding = function(req, res)
{
	sess = req.session;
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
	
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
};

module.exports.showAddArticle = function(req, res)
{
	sess = req.session;
	//strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))

	res.render('add-article.ejs', {sessionUserID: construct_landing_page_meta_data(sess)["user_identification"]});
};

module.exports.signOut = function(req, res)
{
	sess = req.session;
	objCurrentGhostInfo = construct_landing_page_meta_data(sess);
	
	reset_session(sess, objCurrentGhostInfo);
	
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess));
	
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
};

module.exports.signIn = function(req, res)
{
	// operations after a success login
	sess = req.session;
	sess["user_status"] = "signed-in";
	sess["user_identification"] = "zhugechenw@gmail.com";
	
	
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
};

module.exports.OverallAnalyticsControlPanel = function(req, res) {
	sess = req.session;
	var strRankRange = req.body.rank_range;
	
	/* back-end validation: in case malicious user manipulated the input in POST to a non-integer, trying to mess 
	 * around.
	 */ 
	if (Number.isInteger(parseInt(strRankRange)) == true)
	{
		sess["overall_analytics_rank_range"] = strRankRange;
	}
	
	sess["tab_name"] = "overall_analytics";
    
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
};

module.exports.IndividualArticleAnalyticsControlPanel = function(req, res) {
	sess = req.session;
	
	var strTitleNameRaw = req.body.title_name;
	var strTitleName = req.body.title_name;
	// todo not adquate here, use regex: considering titles like USA (# abc (#190), though not likely.
	//regex in HTML: required pattern="^[a-zA-Z0-9]+ \(# [0-9]+\)$"
	var nIndex = strTitleName.indexOf(" (# ");
	if (nIndex != -1)
	{
		strTitleName = strTitleName.substring(0, nIndex);
	}
		
	var aryStrYearRangeArray = req.body.year_range.trim().split("-");
	// user input validation, in case malicious users send manipulated year range message (POST) to me.
	if (aryStrYearRangeArray.length == 2)
	{
		var strStartYear = aryStrYearRangeArray[0].trim();
		var strEndYear = aryStrYearRangeArray[1].trim();
		
		var nStartYear = parseInt(strStartYear);
		var nEndYear = parseInt(strEndYear);
		if (Number.isInteger(nStartYear) == true && 
			Number.isInteger(nEndYear) == true &&
			nStartYear >= parseInt(g_ConstStrWikiPediaStartYear) &&
			nEndYear <= parseInt(new Date().getFullYear()) + 1)
		{
			sess["individual_article_analytics_start_year"] = strStartYear;
			sess["individual_article_analytics_end_year"] = strEndYear;
		}
	}
	
	sess["individual_article_analytics_title_name"] = strTitleName;
	sess["individual_article_analytics_title_name_raw"] = strTitleNameRaw;
	sess["tab_name"] = "individual_article_analytics";
    
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
};

module.exports.AuthorAnalyticsControlPanel = function(req, res) {
	var strAuthorName = req.body.author_name;
	//console.log(strRankRange)
	sess = req.session;
	sess["author_analytics_author_name"] = strAuthorName;
	sess["tab_name"] = "author_analytics";
    
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
};

// ## utilty functions

// Get all the current (in other words, regular) metadata properties. If sess contains them, then delete them from sess.
function reset_session(sess, cur)
{
	for (var property in cur) 
	{
	    if (cur.hasOwnProperty(property)) 
	    {
	    	if (sess.hasOwnProperty(property))
			{
	    		delete sess[property];
			}	        
	    }
	}
}

// overwrite the originObj. If sess has the property as well, sees property content would overwrite the originObj's 
// corresponding property.
function restruct_landing_page_meta_data(originObj, sess)
{
	for (var property in originObj) 
	{
	    if (originObj.hasOwnProperty(property)) 
	    {
	        if (property in sess)
	        {
	        	originObj[property] = sess[property];
	        }
	    }
	}
	
	return originObj;
}

function construct_landing_page_meta_data(sess)
{
	var objMetaData = {};
	
	// ## default properties of the MetaData (would be post-processed by session data later)
	
	// user's session related
	objMetaData["user_status"] = "not-signed-in";
	objMetaData["user_identification"] = "Guest";
	
	// tab displayed to the user
	objMetaData["tab_name"] = "introduction";
	
	// Overall Analytics related
	objMetaData["overall_analytics_rank_range"] = "2";
	
	// Individual Article Analytics related
	objMetaData["individual_article_analytics_title_name"] = "Reserved";
	
	/// only used for UI display, no harm to core functionality
	objMetaData["individual_article_analytics_title_name_raw"] = "ReservedRaw";  
	
	objMetaData["individual_article_analytics_start_year"] = g_ConstStrWikiPediaStartYear;
	objMetaData["individual_article_analytics_end_year"] = new Date().getFullYear();
	
	// Author Analytics related
	objMetaData["author_analytics_author_name"] = "Reserved";
	
	return restruct_landing_page_meta_data(objMetaData, sess);
}



// ## obsolete functions

function get_top_authors(strInput)
{
	var obj = { function_name: "get_top_authors", name: ["John1", "Watson"], age: 30, city: "New York" };
	g_obj = obj;
	return obj;
}


module.exports.showForm = function(req, res) {
    products = req.app.locals.products;
    res.render('survey.ejs', {products: products});
};
