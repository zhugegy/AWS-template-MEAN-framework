google.charts.load('current', {packages: ['corechart']});
google.charts.load('current', {'packages':['bar']});

// Param5 is just for printing legends.
function _sub_draw_bar_chart_year_distribution(arrayRawData, nCurrentYear, nEndYear, strStartYear, strTitleName = "Reserved")
{
	if (nCurrentYear > nEndYear)
	{
		var data = google.visualization.arrayToDataTable(arrayRawData);
		
		var strTitleNameDisplay = "";
		if (strTitleName == "Reserved")
		{
			strTitleNameDisplay = "";
		}
		else
		{
			strTitleNameDisplay = " of Article " + strTitleName;
		}
	      var options = {
	        chart: {
	          title: 'Revision Number Distribution by Year and User Type' + strTitleNameDisplay,
	          subtitle: 'Time Span: ' + strStartYear + "-" + nEndYear.toString(),
	        },
	        bars: 'vertical',
	        vAxis: {format: 'decimal'},
	        height: 400,
	        colors: ['#1b9e77', '#d95f02', '#7570b3', '#62cbe9']
	      };

	      var chart = new google.charts.Bar(document.getElementById('canvasArea'));

	      chart.draw(data, google.charts.Bar.convertOptions(options));
		return;
	}
	
	if (strTitleName == "Reserved")
	{
		$.getJSON('/getData?FunId=overall_analytics_get_user_distributionAsync&Param1=' + nCurrentYear.toString(), {paramNum: 1}, function(rdata) {
			var arrayTmp = [
				nCurrentYear.toString(), 
				rdata.admin_active + rdata.admin_former + rdata.admin_inactive + rdata.admin_semi_active,
				rdata.anon, 
				rdata.bot, 
				rdata.regular]
			arrayRawData.push(arrayTmp);
			
			_sub_draw_bar_chart_year_distribution(arrayRawData, nCurrentYear + 1, nEndYear, strStartYear)
			
		});
	}
	else
	{
		$.getJSON('/getData?FunId=individual_article_analytics_get_user_distribution_Async&Param1=' + nCurrentYear.toString() +
				'&Param2=' + strTitleName, {paramNum: 2}, function(rdata) {
			var arrayTmp = [
				nCurrentYear.toString(), 
				rdata.admin_active + rdata.admin_former + rdata.admin_inactive + rdata.admin_semi_active,
				rdata.anon, 
				rdata.bot, 
				rdata.regular]
			arrayRawData.push(arrayTmp);
			
			_sub_draw_bar_chart_year_distribution(arrayRawData, nCurrentYear + 1, nEndYear, strStartYear, strTitleName)
			
		});
	}
}

function draw_bar_chart_revison_number_distribution()
{
	 var arrayRawData = [
	        ['Year', 'Administrator', 'Anonymous', 'Bot', 'Regular user']
	        ];
	 var nStartYear = 2001;
	 var nEndYear = 2019;
	 
	 _sub_draw_bar_chart_year_distribution(arrayRawData, nStartYear, nEndYear, nStartYear.toString());	
}

function draw_pie_chart_revison_number_distribution()
{
	var dataTable = new google.visualization.DataTable();
    dataTable.addColumn('string', 'User Type');
    dataTable.addColumn('number', 'Revisions');
    // A column for custom tooltip content
    // dataTable.addColumn({type: 'string', role: 'tooltip'});
    // instead of using Google Tooltips Documentation, do it the hard way: 
    // https://stackoverflow.com/questions/39250757/google-charts-how-to-append-text-to-default-tooltip
    
    
	var arrayRawData = [];
	$.getJSON('/getData?FunId=overall_analytics_get_user_distributionAsync&Param1=overall', {paramNum: 1}, function(rdata) {
		var arrayTmp = ['Administrator', rdata.admin_active + rdata.admin_former + rdata.admin_inactive + rdata.admin_semi_active]
		arrayRawData.push(arrayTmp);
		arrayTmp = ['Anonymous', rdata.anon]
		arrayRawData.push(arrayTmp);
		arrayTmp = ['Bot', rdata.bot]
		arrayRawData.push(arrayTmp);
		var arrayTmp = ['Regular', rdata.regular]
		arrayRawData.push(arrayTmp);
		
		dataTable.addRows(arrayRawData);
		
		//var data = google.visualization.arrayToDataTable(arrayRawData);
		
		var options = {
		          title: 'Revision Number Distribution by User Type',
		          tooltip: {
		              isHtml: true
		            },
		            height: 400
		        };

        var chart = new google.visualization.PieChart(document.getElementById('canvasArea'));
        google.visualization.events.addListener(chart, 'onmouseover', function (props) {
            var strUserType = dataTable.getValue(props.row, 0);
            
            if (strUserType != "Administrator")
        	{
            	return;
        	}
            
            var nAdminSum = rdata.admin_active + rdata.admin_former + rdata.admin_inactive + rdata.admin_semi_active;
                        
 
            add_customerized_tooltip('<i>Admin type distribution:</i>', "");
            add_customerized_tooltip('admin-active: ', 
            		"<b>" + rdata.admin_active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
            		" (" + (rdata.admin_active / nAdminSum * 100).toFixed(1) + "%)" + "</b>");            
            
        
	        add_customerized_tooltip('admin-former: ', 
	        		"<b>" + rdata.admin_former.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
	        		" (" + (rdata.admin_former / nAdminSum * 100).toFixed(1) + "%)" + "</b>");
	        
	
			add_customerized_tooltip('admin-inactive: ', 
		    		"<b>" + rdata.admin_inactive.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
		    		" (" + (rdata.admin_inactive / nAdminSum * 100).toFixed(1) + "%)" + "</b>");            
		    
		    add_customerized_tooltip('admin-semi-active: ', 
		    		"<b>" + rdata.admin_semi_active.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + 
		    		" (" + (rdata.admin_semi_active / nAdminSum * 100).toFixed(1) + "%)" + "</b>");  
	    });

        chart.draw(dataTable, options);
	});
}

function draw_bar_chart_yearly_revison_number_distribution_of_article()
{
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strTitleName = objTmp["individual_article_analytics_title_name"];
	var strStartYear = objTmp["individual_article_analytics_start_year"];
	var strEndYear = objTmp["individual_article_analytics_end_year"];
	//alert(strTitleName + strStartYear + strEndYear);
	
	// let the user's latest input make its voice!
	var objUserInputYearRange = document.getElementById("controlPanelTextInputYearRange");
	if (objUserInputYearRange != null)
	{
		var strYearRange = objUserInputYearRange.value;
		var aryStrYearRange = strYearRange.split('-');
		if (aryStrYearRange.length == 2)
		{
			strStartYear = aryStrYearRange[0].trim();
			strEndYear = aryStrYearRange[1].trim();
		}
	}
	
	// don't draw if there is no user input
	if (strTitleName == "Reserved")
	{
		return;
	}
	
	// check if strTitleName in database
	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {
		if (strTitleName != "Reserved" && rdata.titles.includes(strTitleName) == false)
		{
			return;
		}
		
		// ready to go.
		var arrayRawData = [
	        ['Year', 'Administrator', 'Anonymous', 'Bot', 'Regular user']
	        ];
		var nStartYear = parseInt(strStartYear);
		var nEndYear = parseInt(strEndYear);
		
		_sub_draw_bar_chart_year_distribution(arrayRawData, nStartYear, nEndYear, nStartYear.toString(), strTitleName);
    });
	
}

function _sub_draw_pie_chart_year_distribution(arrayRawData, nCurrentYear, nEndYear, strStartYear, strTitleName)
{
	if (nCurrentYear > nEndYear)
	{
        var data = google.visualization.arrayToDataTable([
            ['User Type', 'Revisions'],
            ['Administrator', arrayRawData[0]],
            ['Anonymous', arrayRawData[1]],
            ['Bot', arrayRawData[2]],
            ['Regular', arrayRawData[3]]
          ]);

        var options = {
    	        title: 'Revision Number Distribution by User Type of Article ' + strTitleName + " (" + strStartYear + "-" + nEndYear.toString() + ")",
    	        height: 400,
    	        colors: ['#1b9e77', '#d95f02', '#7570b3', '#62cbe9']
    	      };

          var chart = new google.visualization.PieChart(document.getElementById('canvasArea'));

          chart.draw(data, options);
		return;
	}
	
	$.getJSON('/getData?FunId=individual_article_analytics_get_user_distribution_Async&Param1=' + nCurrentYear.toString() +
			'&Param2=' + strTitleName, {paramNum: 2}, function(rdata) {
		var nAdminSum = rdata.admin_active + rdata.admin_former + rdata.admin_inactive + rdata.admin_semi_active;
		arrayRawData[0] += nAdminSum;
		arrayRawData[1] += rdata.anon;
		arrayRawData[2] += rdata.bot;
		arrayRawData[3] += rdata.regular;
		
		_sub_draw_pie_chart_year_distribution(arrayRawData, nCurrentYear + 1, nEndYear, strStartYear, strTitleName)
		
	});
}


function draw_pie_chart_user_type_distribution_of_article()
{
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strTitleName = objTmp["individual_article_analytics_title_name"];
	var strStartYear = objTmp["individual_article_analytics_start_year"];
	var strEndYear = objTmp["individual_article_analytics_end_year"];
	//alert(strTitleName + strStartYear + strEndYear);
	
	// let the user's latest input make its voice!
	var objUserInputYearRange = document.getElementById("controlPanelTextInputYearRange");
	if (objUserInputYearRange != null)
	{
		var strYearRange = objUserInputYearRange.value;
		var aryStrYearRange = strYearRange.split('-');
		if (aryStrYearRange.length == 2)
		{
			strStartYear = aryStrYearRange[0].trim();
			strEndYear = aryStrYearRange[1].trim();
		}
	}
	
	// don't draw if there is no user input
	if (strTitleName == "Reserved")
	{
		return;
	}
	
	// check if strTitleName in database
	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {
		if (strTitleName != "Reserved" && rdata.titles.includes(strTitleName) == false)
		{
			return;
		}
		
		// ready to go.
		// arrayRawData 0: Admin 1: Anon 3: Bot 4 Regular
		var arrayRawData = [0, 0, 0, 0];
		var nStartYear = parseInt(strStartYear);
		var nEndYear = parseInt(strEndYear);
		
		_sub_draw_pie_chart_year_distribution(arrayRawData, nStartYear, nEndYear, nStartYear.toString(), strTitleName);
    });
}

function _sub_draw_bar_chart_top_users_yearly_revison_number_distribution_of_article(arrayRawData, arrayRawDataLine, nCurrentUser, nCurrentYear, strTitleName, nEndYear, strStartYear)
{
	if (nCurrentYear > nEndYear)
	{
		//draw 
		var data = google.visualization.arrayToDataTable(arrayRawData);

	      var options = {
	    		  chart: {
	    	          title: "Top Contributors' Revision Number Distribution by Year of Article " + strTitleName,
	    	          subtitle: "Time Span:" + strStartYear + "-" + nEndYear.toString(),
	    	        },
	    	        bars: 'vertical',
	    	        vAxis: {format: 'decimal'},
	    	        height: 400,
	    	        colors: ['#000000', '#1b9e77', '#d95f02', '#7570b3', '#62cbe9']
	      };

	      var chart = new google.charts.Bar(document.getElementById('canvasArea'));

	      chart.draw(data, google.charts.Bar.convertOptions(options));
		return;
	}
	if (nCurrentUser >= arrayRawData[0].length)
	{
		//const newArray = [...arrayRawDataLine];
		//arrayRawData.push(arrayRawDataLine);
		arrayRawData.push([]);
		var nLength = arrayRawData.length;
		for (var i = 0; i < arrayRawDataLine.length; i++)
		{
			var strORncontent = arrayRawDataLine[i];
			arrayRawData[nLength - 1][i] = strORncontent;
		}
		
		nCurrentYear += 1; 
		nCurrentUser = 1;
		arrayRawDataLine[0] = nCurrentYear.toString();
		for (var i = 1; i < arrayRawData[0].length; i++)
		{
			arrayRawDataLine[i] = 0;
		}
		
		// call next
		//_sub_draw_bar_chart_top_users_yearly_revison_number_distribution_of_article(arrayRawData, arrayRawDataLine, nCurrentUser, nCurrentYear, strTitleName, nEndYear, strStartYear)
	}
	
	$.getJSON('/getData?FunId=individual_article_analytics_get_user_distributionAsync&Param1=' +
			nCurrentYear.toString() + 
			'&Param2=' + arrayRawData[0][nCurrentUser] +
			'&Param3=' + strTitleName, {paramNum: 3}, function(rdata) {
		arrayRawDataLine[nCurrentUser] = rdata.revision_number;
		
		_sub_draw_bar_chart_top_users_yearly_revison_number_distribution_of_article(arrayRawData, arrayRawDataLine, nCurrentUser + 1, nCurrentYear, strTitleName, nEndYear, strStartYear)
		
	});
	
}

function draw_bar_chart_top_users_yearly_revison_number_distribution_of_article()
{
	// parse ghost information
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strTitleName = objTmp["individual_article_analytics_title_name"];
	var strStartYear = objTmp["individual_article_analytics_start_year"];
	var strEndYear = objTmp["individual_article_analytics_end_year"];
	
	// let the user's latest input make its voice!
	var objUserInputYearRange = document.getElementById("controlPanelTextInputYearRange");
	if (objUserInputYearRange != null)
	{
		var strYearRange = objUserInputYearRange.value;
		var aryStrYearRange = strYearRange.split('-');
		if (aryStrYearRange.length == 2)
		{
			strStartYear = aryStrYearRange[0].trim();
			strEndYear = aryStrYearRange[1].trim();
		}
	}
	
	// don't draw if there is no user input
	if (strTitleName == "Reserved")
	{
		return;
	}
	
	// check if strTitleName in database
	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {
		if (strTitleName != "Reserved" && rdata.titles.includes(strTitleName) == false)
		{
			return;
		}
		
		// ready to go.
		// construct the table column array e.g. ['Year', 'Tom', 'Jim', 'Lily', 'Lucy'] (length depends on the user's selection)
		var arrayTableColumn = ['Year'];
		var lstObjSelectedRows = document.getElementsByClassName("selected");
		
		if (lstObjSelectedRows.length <= 0)
		{
			//alert("Sorry! We can not draw anything for you because you did not select any user. Please select at least one user and try again!")
			
			swal("Sorry!", "We can not draw anything for you because you did not select any user. Please select at least one user and try again!", 
					"warning");
			return;
		}
		
		for (var i = 0; i < lstObjSelectedRows.length; i++)
		{
			arrayTableColumn.push(lstObjSelectedRows[i].id.substr(g_constStrRowIDDuplicationAvoidingToken.length));
		}
		
		var arrayRawData = [];
		arrayRawData.push(arrayTableColumn);
		
		// construct the table line
		var arrayRawDataLine = [strStartYear];
		var nRange = arrayRawData[0].length - 1;
		for (var i = 0; i < nRange; i++)
		{
			arrayRawDataLine.push(0);
		}
	 
		_sub_draw_bar_chart_top_users_yearly_revison_number_distribution_of_article(arrayRawData, arrayRawDataLine, 1, parseInt(strStartYear), strTitleName, parseInt(strEndYear), strStartYear);
    });
}


function add_customerized_tooltip(strLable, strValue)
{
	var container = document.getElementById('canvasArea');
	var tooltip = container.getElementsByTagName('ul');
    var tooltipLabel = container.getElementsByTagName('span');
    if (tooltip.length > 0) {
      // increase tooltip height
      //set to 220px several (4 in this case) times. not so elegant but ok for now.
      tooltip[0].parentNode.style.height = '190px';
      tooltip[0].parentNode.style.width = '240px';

      // add new li element
      var newLine = tooltip[0].appendChild(document.createElement('li'));
      newLine.className = 'google-visualization-tooltip-item';

      // add span for label
      var lineLabel = newLine.appendChild(document.createElement('span'));
      lineLabel.style.fontFamily = tooltipLabel[0].style.fontFamily;
      lineLabel.style.fontSize = tooltipLabel[0].style.fontSize;
      lineLabel.style.color = tooltipLabel[0].style.color;
      lineLabel.style.margin = tooltipLabel[0].style.margin;
      lineLabel.style.textDecoration = tooltipLabel[0].style.textDecoration;
      lineLabel.innerHTML = strLable;

      // add span for value
      var lineValue = newLine.appendChild(document.createElement('span'));
      lineValue.style.fontFamily = tooltipLabel[0].style.fontFamily;
      lineValue.style.fontSize = tooltipLabel[0].style.fontSize;
      lineValue.style.fontWeight = tooltipLabel[0].style.fontWeight;
      lineValue.style.color = tooltipLabel[0].style.color;
      lineValue.style.margin = tooltipLabel[0].style.margin;
      lineValue.style.textDecoration = tooltipLabel[0].style.textDecoration;
      lineValue.innerHTML = strValue;
    }
}