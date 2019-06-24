/*
 * Assignment Requirement List - Overall Analytics (ARL_OA)
 * 
Overall Analytics
For overall analytics, you need to find out and display the following as text:

ARL_OA_1: Titles of the two articles with highest number of revisions. This is the default behavior.
ARL_OA_2: Titles of the two articles with lowest number of revisions. This is the default behavior.
---ARL_OA_3---: The user should be provided with a way to change the number of articles for highest and lowest number of revisions, the same number should be applied to both categories.
ARL_OA_4: The article edited by largest group of registered users. Each wiki article is edited by a number of users, some making multiple revisions. The number of unique users is a good indicator of an article’s popularity.
ARL_OA_5: The article edited by smallest group of registered users.
ARL_OA_6: The top 2 articles with the longest history (measured by age). For each article, the revision with the smallest timestamp is the first revision, indicating the article’s creation time. An article’s age is the duration between now and its creation time.
ARL_OA_7: Article with the shortest history (measured by age).

*/

function overall_analytics_fill_in_table()
{	
	/* Not secure: malicious user can modify the nRankRange which is hidden in ghostInfo, and get whatever numbers 
	 * of rank he wants.
	 * 
	 * However, we have nothing to hide (it's totally safe to reveal the whole database). In the worst case, the
	 *  malicious user modified nRankRange to a string or negative value to cause server side errors, which are 
	 *  tolerable (won't break down the server itself).
	 *
	 * To write more secure code, the scenario would be: 
	 * 1. Get the nRankNumber from server side, using $.getJSON.
	 * 2. In the callback function of $.getJSON, construct a getData URL.
	 * 3. In the callback function of $.getJSON, use $.getJSON again, to retrieve the content data of the table. 
	 * 4. In the callback function of $.getJSON ($.getJSON), render the table with the retrieved data.
	 * 
	 * Considering the getData functions sometimes could require more than 1 parameter (2, 3 or even more depending
	 * on the function), the code may end up with miserable readability.
	 *  
	 * In conclusion, for this project, we trade (not critical) security level for coding convenience. Nevertheless,
	 * this note shall be kept here for future reference.
	 * 
	 * 20190515 notes: a.k.a callback hell, which was now resolved by async & await.
	 */
	
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strRankRange = objTmp["overall_analytics_rank_range"];
		
	ARL_OA_0___pre_check_user_input___(strRankRange);
}

// check if the user has input a range value that is less than the database hold contents (99 as default)
function ARL_OA_0___pre_check_user_input___(strRankRange)
{
	var nRankRange = parseInt(strRankRange);
	
	// get the database hold entire list, and check its length against user's input
	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {
		if (nRankRange > rdata.titles.length)
		{
			//alert("The total available number of titles is " + nArrayLength.toString() +
			//". We can only provide this many for you. Sorry!")
			
			swal("Sorry!", "The total available number of titles is " + rdata.titles.length.toString() +
					". We can only provide this many for you.", "warning");
			
			// ARL_OA table filling operation aborts here, because of invalid user input.
			/* 20190515 notes: No. The process continues, but with a valid range. i.e. We force the user input to
			 * 				   change for a better user experience.
			 */
			
			ARL_OA_0___pre_occupy_rows___(rdata.titles.length.toString());
		}
		else
		{
			ARL_OA_0___pre_occupy_rows___(strRankRange);
		}		
    });
	
}

var g_ConstStrRowId_top_n_titles_with_most_revision = "ARL_OA_tr_top_n_titles_with_most_revison";
var g_ConstStrRowId_top_n_titles_with_least_revision = "ARL_OA_tr_top_n_titles_with_least_revison";
var g_ConstStrRowId_titles_with_most_users = "ARL_OA_tr_titles_with_most_users";
var g_ConstStrRowId_titles_with_least_users = "ARL_OA_tr_titles_with_least_users";
var g_ConstStrRowId_two_title_with_longest_history = "ARL_OA_tr_two_title_with_longest_history";
var g_ConstStrRowId_two_title_with_shortest_history = "ARL_OA_tr_title_with_shortest_history";
// reserve rows for each assignment requirement
/* advantages compared to previous linear callback approach (i.e. table size grows dynamically as the data is 
 * retrieved from back-end):
 * The user will get the whole table instantly, without waiting the fetching data process to be done.
 * We now reserve the incoming data with a spinner that indicates the fetching is going on, which is quite a modern 
 * design and intuitive user experience.
 * 
 */
function ARL_OA_0___pre_occupy_rows___(strRankRange)
{
	// change the input box to user's input value, to achieve UI consistency. 
	var objInputBox = document.getElementById("controlPanelTextInputRankRange");
	if (objInputBox != null)
	{
		objInputBox.value = strRankRange;
	}
	
	var objTable = document.getElementById("table_content_tobefilled");

	// ARL_OA_1___top_n_titles_with_most_revision
	fill_static_info_to_table(objTable, 
			"Titles of the " + strRankRange + " articles with <b>highest</b> number of revisions",
			"Title", 
			"Revisons",
			g_ConstStrRowId_top_n_titles_with_most_revision);
    
	// ARL_OA_2___top_n_titles_with_least_revision
	fill_static_info_to_table(objTable, 
			"Titles of the " + strRankRange + " articles with <b>lowest</b> number of revisions",
			"Title", 
			"Revisons",
			g_ConstStrRowId_top_n_titles_with_least_revision);
	
	// ARL_OA_4___titles_with_most_users
	fill_static_info_to_table(objTable, 
			"Title of the article edited by <b>largest</b> group of registered users",
			"Title", 
			"Unique Users",
			g_ConstStrRowId_titles_with_most_users);
	
	// ARL_OA_5___titles_with_least_users
	fill_static_info_to_table(objTable, 
			"Title of the article edited by <b>smallest</b> group of registered users",
			"Title", 
			"Unique Users",
			g_ConstStrRowId_titles_with_least_users);
		
	// ARL_OA_6___two_title_with_longest_history
	fill_static_info_to_table(objTable, 
			"Title of the articles with the <b>longest</b> history",
			"Title", 
			"History (Age)",
			g_ConstStrRowId_two_title_with_longest_history);
	
	// ARL_OA_7___title_with_shortest_history
	fill_static_info_to_table(objTable, 
			"Title of the article with the <b>shortest</b> history",
			"Title", 
			"History (Age)",
			g_ConstStrRowId_two_title_with_shortest_history);
		
	ARL_OA_0___start_fetching_data___(strRankRange);
}

//lease the monsters.
function ARL_OA_0___start_fetching_data___(strRankRange)
{
	ARL_OA_1___top_n_titles_with_most_revision___(strRankRange);
	ARL_OA_2___top_n_titles_with_least_revision___(strRankRange);
	ARL_OA_4___title_with_most_users___();
	ARL_OA_5___title_with_least_users___();
	ARL_OA_6___two_title_with_longest_history___();
	ARL_OA_7___title_with_shortest_history___();
}

function get_link_element_with_title(strTitle)
{
	var a = document.createElement('a');
	var linkText = document.createTextNode(strTitle);
	a.appendChild(linkText);
	//a.title = "my title text111";
	a.href = "https://en.wikipedia.org/wiki/" + strTitle.replace(/ /g, "_");

	return a;
}

function ARL_OA_1___top_n_titles_with_most_revision___(strRankRange)
{
	$.getJSON('/getData?FunId=overall_analytics_get_n_titles_with_most_revisions&Param1=' + strRankRange, {paramNum: 1}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_top_n_titles_with_most_revision);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");		
		
		var nCounter = 0;
		var nRowNum = nAnchorIndex;
		while (nCounter < parseInt(strRankRange))
		{
			var newRow = objTable.insertRow(nRowNum);
			nRowNum += 1;

			var td1 = newRow.insertCell(0);
			td1.appendChild(get_link_element_with_title(rdata.title_lst[nCounter]));

			newRow.insertCell(1).appendChild(document.createTextNode(rdata.revision_number_lst[nCounter]));
			nCounter += 1;
		}
		
    });
}

function ARL_OA_2___top_n_titles_with_least_revision___(strRankRange)
{
	$.getJSON('/getData?FunId=overall_analytics_get_n_titles_with_least_revisions&Param1=' + strRankRange, {paramNum: 1}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_top_n_titles_with_least_revision);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var nCounter = 0;
		var nRowNum = nAnchorIndex;
		while (nCounter < parseInt(strRankRange))
		{
			var newRow = objTable.insertRow(nRowNum);
			nRowNum += 1;
			
			newRow.insertCell(0).appendChild(get_link_element_with_title(rdata.title_lst[nCounter]));
			newRow.insertCell(1).appendChild(document.createTextNode(rdata.revision_number_lst[nCounter]));
			nCounter += 1;
		}
		
    });
}

function ARL_OA_4___title_with_most_users___()
{
	$.getJSON('/getData?FunId=overall_analytics_get_title_with_most_unique_users', {paramNum: 0}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_titles_with_most_users);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(rdata.title));
		newRow.insertCell(1).appendChild(document.createTextNode(rdata.user_count));
    });
}

function ARL_OA_5___title_with_least_users___()
{
	$.getJSON('/getData?FunId=overall_analytics_get_title_with_least_unique_users', {paramNum: 0}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_titles_with_least_users);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(rdata.title));
		newRow.insertCell(1).appendChild(document.createTextNode(rdata.user_count));
    });
}

function ARL_OA_6___two_title_with_longest_history___()
{
	$.getJSON('/getData?FunId=overall_analytics_top_two_title_with_longest_history', {paramNum: 0}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_two_title_with_longest_history);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(rdata.title_lst[0]));
		
		var secondsPre = new Date(rdata.age_lst[0]).getTime() / 1000;
		var secondsNow = Date.now() / 1000 | 0;
		var secondsDiffer = secondsNow - secondsPre;
		var strTimeGap = utility_construct_time_string(secondsDiffer, true);
		newRow.insertCell(1).appendChild(document.createTextNode(rdata.age_lst[0].replace("T", " ").replace("Z", "") + " ==> " +
				strTimeGap));
		
		var newRow = objTable.insertRow(nAnchorIndex + 1);
		newRow.insertCell(0).appendChild(document.createTextNode(rdata.title_lst[1]));
		
		secondsPre = new Date(rdata.age_lst[1]).getTime() / 1000;
		secondsDiffer = secondsNow - secondsPre;
		strTimeGap = utility_construct_time_string(secondsDiffer, true);
		newRow.insertCell(1).appendChild(document.createTextNode(rdata.age_lst[1].replace("T", " ").replace("Z", "") + " ==> " +
				strTimeGap));
    });
}

function ARL_OA_7___title_with_shortest_history___()
{
	$.getJSON('/getData?FunId=overall_analytics_title_with_shortest_history', {paramNum: 0}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_two_title_with_shortest_history);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(rdata.title));
		
		var secondsPre = new Date(rdata.age).getTime() / 1000;
		var secondsNow = Date.now() / 1000 | 0;
		var secondsDiffer = secondsNow - secondsPre;
		var strTimeGap = utility_construct_time_string(secondsDiffer, true);
		
		newRow.insertCell(1).appendChild(document.createTextNode(rdata.age.replace("T", " ").replace("Z", "") + " ==> " +
				strTimeGap)); 
    });
}

/*
 * Assignment Requirement List - Individual Article A
 * nalytics (ARL_IAA)
 * 
Individual Article Analytics
ARL_IAA_1:There should be a message indicating if a data pulling request is made and if so, how many new revisions have been downloaded. It is possible that a data pulling request is made, but the article has no new revision to be downloaded.

For the selected article, display the following summary information:

ARL_IAA_2:The title
	     :The total number of revisions
ARL_IAA_3:The top 5 regular users ranked by total revision numbers on this article, and the respective revision numbers.
*/
function individual_article_analytics_fill_in_table()
{
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strTitleName = objTmp["individual_article_analytics_title_name"];
	
	// if user havn't input any title, then don't do anything (stupid).
	if (strTitleName == "Reserved")
	{
		return;
	}
	
	ARL_IAA_0___valid_title___(strTitleName);
}

//function ARL_IAA_1(strTitleName)
//{
//	ARL_IAA_1_sub1(strTitleName);
//}
// ARL_IAA_0___valid_title___:Check if this article is in database
/* malicious user may manipulate the input, by changing the POST form information and bypassing input restriction.
 * 
 */
function ARL_IAA_0___valid_title___(strTitleName)
{	
	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {
		if (strTitleName != "Reserved" && rdata.titles.includes(strTitleName) == false)
		{
			//alert("Sorry! The title you entered is not in the database")			
			swal("Sorry!", "The title you entered is not in the database!", "error");
			return;
		}
		
		// make UI consistency
		var objInputBox = document.getElementById("controlPanelTextInputTitleName");
		if (objInputBox != null)
		{
			var pos = rdata.titles.indexOf(strTitleName);
			var strTmp = strTitleName + " (# " + rdata.revisions[pos] + ")";
			objInputBox.value = strTmp;
		}
		
		ARL_IAA_0___pre_occupy_rows___(strTitleName);
    });
	
}

var g_ConstStrRowId_update_check_before_query = "ARL_IAA_tr_update_check_before_query";
var g_ConstStrRowId_update_check_after_query = "ARL_IAA_tr_update_check_after_query";
var g_ConstStrRowId_article_basic_information = "ARL_IAA_tr_article_basic_information";
var g_ConstStrRowId_article_top_contributors = "ARL_IAA_tr_article_top_contributors";

var g_ConstStrRowId_IAA_notification_1 = "ARL_IAA_tr_notification_1";  

function ARL_IAA_0___pre_occupy_rows___(strTitleName)
{	
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strStartYear = objTmp["individual_article_analytics_start_year"];
	var strEndYear = objTmp["individual_article_analytics_end_year"];
	var objTable = document.getElementById("table_content_tobefilled");

	// first two lines (index 0 and 1) are for status display
	objTable.innerHTML += 
	"<tr>" +
	"<td class=\"tabContentTable_inlineNotificationGrey\" colspan=2>Decision in process: whether to pull fresh data from WikiPedia...</td>" +
    "</tr>" + 
    "<tr id = \"" + g_ConstStrRowId_IAA_notification_1 + "\">" +  /* important: row id is here for later reference */
    "<td>" + "<div class=\"loader\"></div>" +  "</td>" +
    "</tr>";
	
	var date = new Date();
	var strDateTimeZone = date.toString().substr(34);
	
	// ARL_IAA_1_sub1___update_check_before_query
	fill_static_info_to_table(objTable, 
			"Freshness status <b>before</b> this query",
			"Timestamp " + strDateTimeZone, 
			"Gap",
			g_ConstStrRowId_update_check_before_query);
	
	// ARL_IAA_1_sub2___update_check_after_query
	fill_static_info_to_table(objTable, 
			"Freshness status <b>after</b> this query",
			"Timestamp " + strDateTimeZone,
			"Gap",
			g_ConstStrRowId_update_check_after_query);
	
	// ARL_IAA_2___article_basic_information
	var strTmpBasicInformation = "Basic information of <b>" + strTitleName + "</b> between <b>" + strStartYear + "</b> and <b> " + strEndYear + "</b>";
	fill_static_info_to_table(objTable, 
			strTmpBasicInformation,
			"Title", 
			"Revisions",
			g_ConstStrRowId_article_basic_information);
	
	// ARL_IAA_3___article_top_contributors
	var strTmpTopContributors = "Top 5 contributors between <b>" + strStartYear + "</b> and <b> " + strEndYear + " (click row to toggle users for analytics)</b>";
	fill_static_info_to_table(objTable, 
			strTmpTopContributors,
			"Name", 
			"Revisions",
			g_ConstStrRowId_article_top_contributors);
	
	ARL_IAA_0___start_fetching_data_stage_1___(strTitleName);
}

// stage 1: update the freshness
function ARL_IAA_0___start_fetching_data_stage_1___(strTitleName)
{
	$.getJSON('/getData?FunId=individual_article_analytics_get_title_last_timestampAsy&Param1=' + strTitleName, {paramNum: 1}, function(rdata) {		
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_update_check_before_query);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		var date = new Date(rdata.last_timestamp);	
		//var strDateRefined = strDate.substr(0, 24);  //+ "\r\n" + strDate.substr(24);
		
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(date.toString().substr(0, 24)));
		
		
		var secondsPre = date.getTime() / 1000;
		var secondsNow = Date.now() / 1000 | 0;
		var secondsDiffer = secondsNow - secondsPre;
		var strTimeGap = utility_construct_time_string(secondsDiffer);
		newRow.insertCell(1).appendChild(document.createTextNode(strTimeGap));
		
		// change the notification line
		nAnchorIndex = when_new_data_comes(g_ConstStrRowId_IAA_notification_1);
		if (nAnchorIndex == -1)
		{
			return;
		}

		var newRow = objTable.insertRow(nAnchorIndex);
		var newCell = newRow.insertCell(0);
		
		var strIsUpToDate = "1";
		if (secondsDiffer /* < */ <  60 * 60 * 24)
		{
			strIsUpToDate = "1";
				
			newCell.appendChild(document.createTextNode("Decision done: Gap < 24 hours, we won't pull new data from WikiPedia API!"));
			newCell.className = "tabContentTable_inlineNotificationGrey";
			newCell.colSpan = 2;
		}
		else
		{
			strIsUpToDate = "0";

			newCell.appendChild(document.createTextNode("Decision done: Gap > 24 hours, we are pulling new data from WikiPedia API..."));
			newCell.className = "tabContentTable_inlineNotificationGrey";
			newCell.colSpan = 2;
		}
		
		var newRowSpinner = objTable.insertRow(nAnchorIndex + 1);
		var newCellSpinner = newRowSpinner.insertCell(0);
		
		var div = document.createElement("DIV");   
		div.className = "loader";                  
		
		newCellSpinner.appendChild(div);
		newRowSpinner.id = g_ConstStrRowId_IAA_notification_1;
	
		ARL_IAA_0___start_fetching_data_stage_2___(strTitleName, strIsUpToDate, rdata.last_timestamp);
    });
}

// query API
function ARL_IAA_0___start_fetching_data_stage_2___(strTitleName, strIsUpToDate, strLastTimestamp)
{
	$.getJSON('/getData?FunId=miscellaneous_fetch_data_from_wikipedia&Param1=' + strTitleName +
			'&Param2=' + strIsUpToDate + '&Param3=' + strLastTimestamp, 
			{paramNum: 3}, function(rdata) {		
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_IAA_notification_1);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		var newRow = objTable.insertRow(nAnchorIndex);
		var newCell = newRow.insertCell(0);
	   
		// is up-to-date
	   if (strIsUpToDate == "1")
	   {
			
			newCell.appendChild(document.createTextNode("This data is up-to-date (no pull from API)!"));
			newCell.className = "tabContentTable_inlineNotificationGreen";
			newCell.colSpan = 2;
	   }
		
	   // is not up-to-date, here we got the new data pulled from WikiPedia API
	   if (strIsUpToDate == "0")
	   {
		   var nUpdatedRevisions = rdata.revisions_updated;
		   
		   	newCell.appendChild(document.createTextNode("This data is up-to-date! " + nUpdatedRevisions.toString() + " new revisions have been pulled from API!"));
			newCell.className = "tabContentTable_inlineNotificationGreen";
			newCell.colSpan = 2;
			
		   // make UI consistency
			var objInputBox = document.getElementById("controlPanelTextInputTitleName");
			if (objInputBox != null)
			{
				var strCurrentValue = objInputBox.value;
				var nIndex = strCurrentValue.indexOf(" (# ");
				var nLength = strCurrentValue.length;
				var nPreRevisions = strCurrentValue.substring(nIndex + 4, nLength - 1);
				var nNewRevisonNum = parseInt(nPreRevisions) + nUpdatedRevisions;
				var strTmp = strTitleName + " (# " + nNewRevisonNum.toString() + ")";
				objInputBox.value = strTmp;
			}  
	   	}
	   
	   ARL_IAA_0___start_fetching_data_stage_3___(strTitleName);

    });
}

// release the monsters!
function ARL_IAA_0___start_fetching_data_stage_3___(strTitleName)
{
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strStartYear = objTmp["individual_article_analytics_start_year"];
	var strEndYear = objTmp["individual_article_analytics_end_year"];
	
	ARL_IAA_1___update_check_after_query___(strTitleName);
	ARL_IAA_2___article_basic_information___(strTitleName, strStartYear, strEndYear);
	ARL_IAA_3___article_top_contributors___(strTitleName, 5, strStartYear, strEndYear);
}

function ARL_IAA_1___update_check_after_query___(strTitleName)
{
	$.getJSON('/getData?FunId=individual_article_analytics_get_title_last_timestampAsy&Param1=' + strTitleName, {paramNum: 1}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_update_check_after_query);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var date = new Date(rdata.last_timestamp);	
		
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(date.toString().substr(0, 24)));
		
		var secondsPre = date.getTime() / 1000;
		var secondsNow = Date.now() / 1000 | 0;
		var secondsDiffer = secondsNow - secondsPre;
		var strTimeGap = utility_construct_time_string(secondsDiffer);
		newRow.insertCell(1).appendChild(document.createTextNode(strTimeGap));
    });
}

function ARL_IAA_2___article_basic_information___(strTitleName, strStartYear, strEndYear)
{
	$.getJSON('/getData?FunId=individual_article_analytics_get_title_infoAsync&Param1=' 
			+ strTitleName +
			'&Param2=' + strStartYear +
			'&Param3=' + strEndYear, {paramNum: 3}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_article_basic_information);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var date = new Date(rdata.last_timestamp);	
		
		var newRow = objTable.insertRow(nAnchorIndex);
		newRow.insertCell(0).appendChild(document.createTextNode(strTitleName));
		newRow.insertCell(1).appendChild(document.createTextNode(rdata.revisions.toString()));
    });
}

var g_constStrRowIDDuplicationAvoidingToken = "in_case_of_duplicate";
//export it to graph_drawer (to transform row id into WikiPedia user name)

function ARL_IAA_3___article_top_contributors___(strTitleName, strTopRank, strStartYear, strEndYear)
{
	$.getJSON('/getData?FunId=individual_article_analytics_get_title_contributing_infoAsync&Param1=' 
			+ strTitleName +
			'&Param2=' + strTopRank + 
			'&Param3=' + strStartYear +
			'&Param4=' + strEndYear, {paramNum: 4}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_article_top_contributors);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var nCounter = 0;
		var nRowNum = nAnchorIndex;
		
		var nTmpRange = parseInt(strTopRank);
		if (rdata.contributing_user_lst.length < nTmpRange)
		{
			nTmpRange = rdata.contributing_user_lst.length;
		}
		
		while (nCounter < nTmpRange)
		{
			var newRow = objTable.insertRow(nRowNum);
			nRowNum += 1;
			newRow.className = "clickable selected";
			newRow.id = g_constStrRowIDDuplicationAvoidingToken + rdata.contributing_user_lst[nCounter];
			
			newRow.insertCell(0).appendChild(document.createTextNode(rdata.contributing_user_lst[nCounter]));
			newRow.insertCell(1).appendChild(document.createTextNode(rdata.revision_number_lst[nCounter]));
			nCounter += 1;
		}
		
		var lstObjClickableRows = document.getElementsByClassName("clickable");
		for (var i = 0; i < lstObjClickableRows.length; i++)
		{
			lstObjClickableRows[i].onclick = table_row_selection_toggler;
		}
    });
}

function table_row_selection_toggler()
{
	this.classList.toggle("selected");
}

/*
 * Assignment Requirement List - Author Analytics (ARL_AA)
 * 
Author Analytics
In this page, you should 

ARL_AA_1: enable the end user to display all articles that are changed (or have revisions made) by a specific author. To do so, you should allow the end user to an author name in a free text format.

You should display the articles’ names along with number of revisions made by that author next to it. 

ARL_AA_2: The end user should also be able to select to see time stamps of all revisions made to an article, if that author made more than revision to an article he is attributed with.
*/
function author_analytics_fill_in_table()
{
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strAuthorName = objTmp["author_analytics_author_name"];
	
	
	if (strAuthorName == "Reserved")
	{
		return;
	}
	
	// change the input box, to achieve UI consistency. 
	var objInputBox = document.getElementById("controlPanelTextInputAuthorName");
	if (objInputBox != null)
	{
		objInputBox.value = strAuthorName;
	}
	
	ARL_AA_0___pre_occupy_rows___(strAuthorName);
	//ARL_AA_1(strAuthorName);
}

var g_ConstStrRowId_author_contribution_info = "ARL_IAA_tr_author_contribution_info";

function ARL_AA_0___pre_occupy_rows___(strAuthorName)
{	
	var objTable = document.getElementById("table_content_tobefilled");
	
	objTable.innerHTML += 
		"<tr>" +
        "<td class=\"tabContentTable_inlineTitle\" colspan=3>" + "WikiPedia contributions of " + strAuthorName + "</td>" +
        "</tr>"+
		"<tr>" +
        "<td class=\"tabContentTable_th\">" + "Article" + "</td>" + "<td class=\"tabContentTable_th\">" + "Revisons" + "</td>" + "<td class=\"tabContentTable_th\">" + "Timestamps" + "</td>" +
        "</tr>" +
        "<tr id = \"" + g_ConstStrRowId_author_contribution_info + "\">" +  /* important: row id is here for later reference */
        "<td>" + "<div class=\"loader\"></div>" +  "</td>" +
        "</tr>";
	
	ARL_IAA_0___start_fetching_data___(strAuthorName);
}

function ARL_IAA_0___start_fetching_data___(strAuthorName)
{
	ARL_AA_1___author_contribution_info___(strAuthorName);
}

var g_constStrExpansionIndicationMessageToUser = "Click row to expand/collapse details";

function ARL_AA_1___author_contribution_info___(strAuthorName)
{
	$.getJSON('/getData?FunId=author_analytics_get_author_infoAsyn&Param1=' + strAuthorName, {paramNum: 1}, function(rdata) {
		var nAnchorIndex = when_new_data_comes(g_ConstStrRowId_author_contribution_info);
		if (nAnchorIndex == -1)
		{
			return;
		}
		
		var objTable = document.getElementById("table_content_tobefilled");
		
		var nCounter = 0;
		var nRowNum = nAnchorIndex;
		
		var nTmpRange = rdata.contributed_article_lst.length;
		if (nTmpRange == 0)
		{
			var newRow = objTable.insertRow(nRowNum);
			var newCell = newRow.insertCell(0);
			newCell.appendChild(document.createTextNode("This author does not exist!"));
			newCell.className = "tabContentTable_inlineNotificationPink";
			newCell.colSpan = 3;
		}
		
		while (nCounter < nTmpRange)
		{
			var newRow = objTable.insertRow(nRowNum);
			newRow.className = "clickable";
			newRow.id= rdata.contributed_article_lst[nCounter];
			
			nRowNum += 1;
			
			newRow.insertCell(0).appendChild(document.createTextNode(rdata.contributed_article_lst[nCounter]));
			newRow.insertCell(1).appendChild(document.createTextNode(rdata.revision_number_lst[nCounter]));
			
			var div = document.createElement("DIV");   
			div.id =  rdata.contributed_article_lst[nCounter] + "_hidden_div";
			div.appendChild(document.createTextNode(g_constStrExpansionIndicationMessageToUser));
			
			newRow.insertCell(2).appendChild(div);
			
			nCounter += 1;
		}
		
		// set Click event for rows
		var lstObjClickableRows = document.getElementsByClassName("clickable");
		for (var i = 0; i < lstObjClickableRows.length; i++)
		{
			lstObjClickableRows[i].onclick = tableCollapse;
		}

    });
}

function tableCollapse()
{
	strId = this.id;
	var strIdHiddenDiv = strId + "_hidden_div";
	var objHiddenDiv = document.getElementById(strIdHiddenDiv);
	
	if (objHiddenDiv == null)
	{
		return;
	}
	
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strAuthorName = objTmp["author_analytics_author_name"];
	
	if (objHiddenDiv.innerHTML != g_constStrExpansionIndicationMessageToUser)
	{
		objHiddenDiv.innerHTML = g_constStrExpansionIndicationMessageToUser;
		return;
	}
	
	
	$.getJSON('/getData?FunId=author_analytics_get_author_with_article_infoAsyn&Param1=' + strAuthorName +
			'&Param2=' + strId, {paramNum: 2}, function(rdata) {
		var nRevisionTimeListLength = rdata.revision_time.length;
		
		if (nRevisionTimeListLength == 0)	
		{
			// should never be here
			objHiddenDiv.innerHTML = "";
			objHiddenDiv.innerHTML += 
				"<tr>" +
		        "<td class=\"tabContentTable_inlineNotificationPink\" colspan=3>This author does not have any revision on this article!</td>" +
		        "</tr>";		
			return;
		}
		
		var nCounter = 0;
		objHiddenDiv.innerHTML = "";
		while (nCounter < nRevisionTimeListLength)
		{
			objHiddenDiv.innerHTML += 
				"<tr>" +
		        "<td >" + rdata.revision_time[nCounter].replace("T", " ").replace("Z", " ") + "</td>" +
		        "</tr>  <br>";
			nCounter += 1;
		}
    });	
}

function introduction_fill_in_table()
{
	
}

//param1: objTable is here for performance optimization, though it is not necessary for it to be here.
function table_static_info_filler(objTable, strInlineTitle, strTableHead1, strTableHead2, strReservedRowId)
{
	objTable.innerHTML += 
		"<tr>" +
        "<td class=\"tabContentTable_inlineTitle\" colspan=2>" + strInlineTitle + "</td>" +
        "</tr>"+
		"<tr>" +
        "<td class=\"tabContentTable_th\">" + strTableHead1 + "</td>" + "<td class=\"tabContentTable_th\">" + strTableHead2 + "</td>" +
        "</tr>" +
        "</tr>" +
        "<tr id = \"" + strReservedRowId + "\">" +  /* important: row id is here for later reference */
        "<td>" + "<div class=\"loader\"></div>" +  "</td>" +
        "</tr>";
}

// removes the spinner
// return the index to insert the data
function when_new_data_comes(strRowId)
{
	var objTable = document.getElementById("table_content_tobefilled");
	if (objTable == null)
	{
		return -1;
	}
	
	// check if this row still exists (user may have already switched to another tab when this data comes)
	/* Setting the innerHTML of a null object won't breakdown anything (will only result in a warning message in 
	 * front-end browser's console). Nevertheless, we still check it for good software quality.
	 */ 
	var objRow = document.getElementById(strRowId);
	if (objRow == null)
	{
		return -1;
	}
	
	var nAnchorIndex = objRow.rowIndex;
	// erase the existing content. i.e. the spinner.
	objTable.deleteRow(nAnchorIndex);
	
	return nAnchorIndex;
}

function fill_static_info_to_table(objTable, strInlineTitle, strTableHead1, strTableHead2, strReservedRowId)
{
	objTable.innerHTML += 
		"<tr>" +
        "<td class=\"tabContentTable_inlineTitle\" colspan=2>" + strInlineTitle + "</td>" +
        "</tr>"+
		"<tr>" +
        "<td class=\"tabContentTable_th\">" + strTableHead1 + "</td>" + "<td class=\"tabContentTable_th\">" + strTableHead2 + "</td>" +
        "</tr>" +
        "</tr>" +
        "<tr id = \"" + strReservedRowId + "\">" +  /* important: row id is here for later reference */
        "<td>" + "<div class=\"loader\"></div>" +  "</td>" +
        "</tr>";
}

function utility_construct_time_string(nSecondsDiffer, bIsRoughYear =false)
{
	var secondsDiffer = nSecondsDiffer;
	
	var days = Math.floor(secondsDiffer / (3600*24));
	secondsDiffer  -= days*3600*24;
	var hrs   = Math.floor(secondsDiffer / 3600);
	secondsDiffer  -= hrs*3600;
	var mnts = Math.floor(secondsDiffer / 60);
	secondsDiffer  -= mnts*60;
	var seconds = secondsDiffer;
	
	var strTimeGap = "";
	
	if (days != 0)
	{
		if (bIsRoughYear == true && days > 365)
		{
			strRoughYear = (days / 365).toFixed(1);
			return strRoughYear + " years";
		}
		strTimeGap = days.toString() + " days, " + hrs.toString() + " Hours, " + mnts.toString() + " Minutes, " + seconds.toString() + " Seconds"; 
	}
	else if (hrs != 0)
	{
		strTimeGap = hrs.toString() + " Hours, " + mnts.toString() + " Minutes, " + seconds.toString() + " Seconds";
	}
	else if (mnts != 0)
	{
		strTimeGap = mnts.toString() + " Minutes, " + seconds.toString() + " Seconds";
	}
	else
	{
		strTimeGap = seconds.toString() + " Seconds";
	}
	
	return strTimeGap;
}