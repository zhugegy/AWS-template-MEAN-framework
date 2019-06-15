var cons_strHTMLBackbonePath = 'HTMLBodyBackbone/HTMLBodyBackbone.txt';

//var cons_isDebug = false;

// FUNCTION DELETED
// Due to diffculty in reading local jason files, the jason content is read via URL data transfer.
// source: https://stackoverflow.com/questions/19440589/parsing-json-data-from-a-url
// function getJSON(url)

//FUNCTION DELETED
// (temporary) local approach (only for fast debug propose). 'strDataLink' should be from 3rd party JSON storage service.
// function __fetch_data_and_render(strDataLink, funRender)

// (recommended) remote approach. 'strDataLink' resides within backend. Not locally debuggable.
function fetch_data_and_render(strDataLink, funRender)
{
	$.getJSON(strDataLink, function(data) {funRender(data);} );
}

function fetch_data_and_render(strDataLink, funRender, param1)
{
	$.getJSON(strDataLink, function(data) {funRender(data, param1);} );
}

// callback function
function info_table_loaded_inner_callback(strTabName, response)
{
	// ## (optional) do something with the response (a raw html file's content with just an empty table,
	//               not necessary for now)

	// ## Fill in the table with static info 
	
	// For now, static info, a.k.a these json files, have empty content, this line of code is left here just
	// for compatibility / future use.
	fetch_data_and_render('../data/table_contents/' + strTabName + '.json', action_with_table_content_data);
	
	// ## Fill in the table with dynamic info from server side
	
	// construct the function name: each table has a dedicated function for the filling operations.
	strFunName = strTabName + "_fill_in_table";
	
	// trick for reducing redundancy coding: call string, as if this string is a function.
	// e.g. if (strFunName == xxx) {call xxx();} elseif (strFunName == yyy) {call yyy();}
	// essentially equals to calling xxx and yyy
	// e.g. (in this project) overall_analytics_fill_in_table() and author_analytics_fill_in_table()
	window.settings = {functionName: strFunName};
	window[settings.functionName]();  
}

//callback function
function draw_canvas_loaded_inner_callback(strTabName, response)
{
	// ## (optional) do something with the response (a raw html file's content which is empty,
	//               not necessary for now)

	// ## Fill in the draw canvas with static info 
	
	// For now, static info, a.k.a these json files, have empty content, this line of code is left here just
	// for compatibility / future use.
	fetch_data_and_render('../data/graph_drawer_button_items.json', action_with_graph_drawer_button_data, strTabName);
	
	// ## Fill in the table with dynamic info from server side
}

function getVals(){
	  // Get slider values
	  var parent = this.parentNode;
	  var slides = parent.getElementsByTagName("input");
	    var slide1 = parseFloat( slides[0].value );
	    var slide2 = parseFloat( slides[1].value );
	  // Neither slider will clip the other, so make sure we determine which is larger
	  if( slide1 > slide2 ){ var tmp = slide2; slide2 = slide1; slide1 = tmp; }
	  
//	  var displayElement = parent.getElementsByClassName("rangeValues")[0];
//	      displayElement.innerHTML = slide1 + " - " + slide2;
	      
	  var display2 = document.getElementById("controlPanelTextInputYearRange");
	  display2.value = slide1 + " - " + slide2;
	}

//callback function
function control_panel_loaded_inner_callback(strTabName, response)
{
	// ## (optional) do something with the response (a raw html file's content with just an empty table,
	//               not necessary for now)

	// construct the function name: each table has a dedicated function for the filling operations.
	strFunName = strTabName + "_fill_in_panel";
	
	// trick for reducing redundancy coding: call string, as if this string is a function.
	// e.g. if (strFunName == xxx) {call xxx();} elseif (strFunName == yyy) {call yyy();}
	// essentially equals to calling xxx and yyy
	// e.g. (in this project) overall_analytics_fill_in_table() and author_analytics_fill_in_table()
	window.settings = {functionName: strFunName};
	window[settings.functionName]();  
}

var g_nMenuClickTimer = 0;
var g_bNeedSignedIn = false;

function menuItems_listener()
{
	// check if the user has clicked way way too quickly (3 seconds interval for swtiching tabs)
	/* 
	 * Reason: to avoid mis-placement of table and canvas contents, as table and canvas are "public-shared" area for all tabs.
	 * Explanation of mis-placement: the initializing function of table / canvas is callback function, they happened after the
	 * 								 advanced issues are solved, thus the delay, thus we may see Individual Article Analytics 
	 * 								 table in Overall Analytics tab if we click like this: from OA tab -> click IAA menu 
	 * 								 button -> in 0.5 seconds, click OA menu button -> wait to see IAA table displayed in the
	 * 								 OA tab, which is not cool and should be avoided.
	*/
	var nCurrentTime = new Date().getTime();
	if (nCurrentTime - g_nMenuClickTimer < 3 * 1000)
	{
		//alert("too quick!");
		return;
	}
	else
	{
		g_nMenuClickTimer = nCurrentTime;
	}
	
	// check user status: no functionality available for a guest. except for the Introduction tab. :-)
	
	// the not secure way: get data from ghostInfo embedded in raw HTML file. (DELETED)
	// the secure way: get fresh session status from server.
	strId = this.id;
	strTmpItemName = strId.slice("menu_item_".length);
	
	$.getJSON('/getData?FunId=miscellaneous_get_session_user_stauts', {paramNum: 0}, function(rdata) {
		if (g_bNeedSignedIn == true && rdata["user_status"] != "signed-in" && strTmpItemName != "introduction")
		{
			//alert("Please sign in! This feature is only for registered users");
			swal("Please log in!", "This feature is only for registered users.", "error");
			return
		}
		load_informative_compenent(strTmpItemName);
    });	
}

function graphDrawerButtonItems_listener()
{
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strCurrentTitle = objTmp["individual_article_analytics_title_name"];
	
	strId = this.id;
	strTmpFunctionName = strId;
	
	
	if (strCurrentTitle != "Reserved")
	{
		var objDivCanvas = document.getElementById("canvasArea");
		objDivCanvas.innerHTML = "<p>Drawing... Please wait...</p>" + "<div class=\"loader\"></div>";
	}
	// trick for reducing redundancy coding: call string, as if this string is a function.
	// see info_table_loaded_inner_callback() for detailed explanation
	window.settings = {functionName: strTmpFunctionName};
	window[settings.functionName](); 
}

function action_with_menu_data(jsonData)
{
	var lMenuItems = jsonData;
	var strLang = $('html')[0].lang;
	var menuItemsList = document.getElementById("menuItemsList");

	for (var i = 0; i < lMenuItems.length; i++)
	{
		// obsolete implementation: link (href). <li class="menuItem"><a href="#home">Home</a></li>
		
		// current implementation: just one image as the list element.
		strTmpLink = "<li class=\"menuItem\" id=\"" + lMenuItems[i].id + "\">" +  
		"<img src=\"images/menu/" + lMenuItems[i].name + "_" + strLang + "." + lMenuItems[i].image_format +
		"\" alt=\"" + lMenuItems[i].name + "\"></li>";
		
		menuItemsList.innerHTML += strTmpLink;
	}

	// register the menu items for user interactions later on
	var menuItems = document.getElementsByClassName("menuItem");
	for (var i = 0; i < menuItems.length; i++)
	{
		menuItems[i].onclick = menuItems_listener;
	}
}

function action_with_graph_drawer_button_data(jsonData, strTabName)
{
	var lButtonItems = jsonData;
	var strLang = $('html')[0].lang;
	var objButtonItemsArea = document.getElementById("buttonArea");

	var strNameTmp = "name_" + strLang;
	for (var i = 0; i < lButtonItems.length; i++)
	{
		if (lButtonItems[i]["tab"] != strTabName)
		{
			continue;
		}
		strTmp = "<button class=\"graphDrawerButtonItem\" id=\"" + lButtonItems[i].function_name + "\">" +  
		lButtonItems[i][strNameTmp] + "</button>";
		
		objButtonItemsArea.innerHTML += strTmp;
	}

	// register the menu items for user interactions later on
	var objButtonItems = document.getElementsByClassName("graphDrawerButtonItem");
	for (var i = 0; i < objButtonItems.length; i++)
	{
		objButtonItems[i].onclick = graphDrawerButtonItems_listener;
	}
	
}

// Depending on whether the user is a Guest or a Registered Users, there would be different icons to display.  
function update_avaiable_user_switch_icons(jsonData)
{
	var strLang = $('html')[0].lang;
	var lUserSwitchItems = jsonData;
	var divUserSwitchArea = document.getElementsByClassName("switchUserDropDownContent")[0];
	
	$.getJSON('/getData?FunId=miscellaneous_get_session_user_stauts', {paramNum: 0}, function(rdata) {
		var strUserStatus = rdata["user_status"];
		for (var i = 0; i < lUserSwitchItems.length; i++)
		{
			if ((lUserSwitchItems[i]["required-user-status"]) == strUserStatus)
			{
				divUserSwitchArea.innerHTML += "<a href = \"" + lUserSwitchItems[i]["link"] + "\">" + lUserSwitchItems[i]["content_" + strLang] + "</a>";
			}		
		}
    });	
	
}

function action_with_user_switch_data(jsonData)
{
	var divUserSwitchArea = document.getElementsByClassName("switchUserDropDownContent")[0];
	
	// display user identification (not secure. malicious users can change the user identification).
	// var strGhost = document.getElementById("ghostInfo").innerHTML;
	// var objTmp = JSON.parse(strGhost);	
	//divUserSwitchArea.innerHTML += "<span>"  + objTmp["user_identification"] + "</span>"; 
	
	// display user identification (secure. Data is freshly retrieved from server side).
	$.getJSON('/getData?FunId=miscellaneous_get_session_user_identification', {paramNum: 0}, function(rdata) {
		divUserSwitchArea.innerHTML += "<span>"  + rdata["user_identification"] + "</span>"; 
		update_avaiable_user_switch_icons(jsonData);
    });	
}

// fill in the table with default static information
// a template can be seen in /public/data/table_contents/tempalte.json
// Currently there is no static information (lDataEntries.length = 0), thus this function is redundancy.
function action_with_table_content_data(jsonData)
{
	var lDataEntries = jsonData;
	var strLang = $('html')[0].lang;
	var strContentPropertyName = 'content_' + strLang;

	for (var i = 0; i < lDataEntries.length; i++)
	{
		if(lDataEntries[i].hasOwnProperty(strContentPropertyName))
		{
			strContentTmp = lDataEntries[i].format.join("");
			
			var j = 0;
			while (strContentTmp.indexOf('$') > -1)
			{
			  strToWriteIn = lDataEntries[i][strContentPropertyName][j];
			  strContentTmp = strContentTmp.replace('$', strToWriteIn);
			  j++;
			}

			var strTargetDivName = lDataEntries[i]["field"] + "_tobefilled";
			document.getElementById(strTargetDivName).innerHTML += strContentTmp;
		}
	}
}

function load_informative_compenent(strTabName)
{
	// Load the content of the controlPanelBox section.
	$("#controlPanelBox").load("sub_sections/control_panel_" + strTabName + ".html", 
			function (response) 
			{
				/* do somthing here, if you want to futher change the loaded content (not necessary for 
				 * control panels, at least for now, since control panels are all static content.)
				 */
				control_panel_loaded_inner_callback(strTabName, response);
		
			} );
	
	// Load the content of the infoTableBox section. 
	// Content is initially empty, which will be filled in the callback function with the proper data according to strTmpItemName.
	$("#infoTableBox").load("sub_sections/info_table.html", 
			function (response) 
			{
				info_table_loaded_inner_callback(strTabName, response);
			} );
	
	// Load the content of the graphCanvasBox section.
	$("#graphCanvasBox").load("sub_sections/graph_canvas.html", 
			function (response) 
			{
				draw_canvas_loaded_inner_callback(strTabName, response);
			} );
}

function load_body_content()
{
	//fetch static data and display menu
	fetch_data_and_render('../data/menu_items.json', action_with_menu_data);
	
	// fetch static data and display user switch   
	fetch_data_and_render('../data/user_switch_items.json', action_with_user_switch_data);	
	
	// get dynamic data (from MongoDB) and display informative content (controlPanel + infoTable + graphCanvas)
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strCurrentUserTab = objTmp["tab_name"];
	
	load_informative_compenent(strCurrentUserTab);
}

/* Reason of having HTMLBodyBackbone.txt as the backbone:
   To support multi-language feature, e.g. English, Chinese Simplified, Chinese Traditional etc, while adding as 
   less burden to maintenance as possible.
   
   This HTMLBodyBackbone.txt would act as the backbone of the HTML file, regardless of the current language, and
   we don't have to write HTML contents for each language's index.html again and again. 
   
   We just change the <html lang="en"> property of each page, and load_body_backbone_structure(), using the same
   backbone for every language. Some javascripts later would recon the lang property and react correspondingly.
*/
function load_body_backbone_structure()
{
	var request = new XMLHttpRequest();
	request.open('GET', cons_strHTMLBackbonePath, true);
	request.responseType = 'blob';
	
	request.onload = function() {
		var reader = new FileReader();
		reader.readAsText(request.response);
		
		// anonymous call-back when file reading is done.
		reader.onload =  function(e){
			var bodyArea = document.getElementsByTagName('body')[0];
			bodyArea.innerHTML += e.target.result;

			load_body_content();
		};
	};
	
	request.send();
}

// entry point
window.onload = function()
{	
	load_body_backbone_structure();	
}

