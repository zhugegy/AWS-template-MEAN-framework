function overall_analytics_fill_in_panel()
{
	// fill in input text to achieve UI consistency
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strRankRange= objTmp["overall_analytics_rank_range"];
	
	var objInputTextBox = document.getElementById("controlPanelTextInputRankRange");
	
	if (objInputTextBox != null)
	{
		objInputTextBox.value = strRankRange;
	}
	
}

function author_analytics_fill_in_panel()
{
	
}

function introduction_fill_in_panel()
{
	
}

function individual_article_analytics_fill_in_panel()
{
	// fill in input text to achieve UI consistency
	var strGhost = document.getElementById("ghostInfo").innerHTML;
	var objTmp = JSON.parse(strGhost);
	var strArticleNameRaw = objTmp["individual_article_analytics_title_name_raw"];
	
	var objInputTextBox = document.getElementById("controlPanelTextInputTitleName");
	
	if (strArticleNameRaw != "ReservedRaw" && objInputTextBox != null)
	{
		objInputTextBox.value = strArticleNameRaw;
	}
		
	// dynamically fill the available text input options
	var objTable = document.getElementById("titleNames");
	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {
		
		var nLength = rdata.titles.length;
		var nCounter = 0;
		var strTmp;
		while (nCounter < nLength)
		{
			strTmp = rdata.titles[nCounter] + " (# " + rdata.revisions[nCounter] + ")";
			//objTable.innerHTML += "<option value=\"" + strTmp + "\">";
			objTable.innerHTML += "<option>" + strTmp + "</option>";
			nCounter += 1;
		}
    });
	
	// grey out the year range input (it is already read-only)
	/*
	 * reason of not using "disabled = disabled" to grey it out: can not retrieve its value in back-end when 
	 * form is submitted.
	 */
	var objYearRangeInput = document.getElementById("controlPanelTextInputYearRange");
	objYearRangeInput.style.backgroundColor = "#DDDDDD";
	
	// init the YearRange, keeping UI consistency
	var strStartYear = objTmp["individual_article_analytics_start_year"];
	var strEndYear = objTmp["individual_article_analytics_end_year"];
	
	var objSlider1 = document.getElementById("slider1");
	if (objSlider1 != null)
	{
		objSlider1.max = new Date().getFullYear();
		objSlider1.value = strStartYear;
	}
	
	var objSlider2 = document.getElementById("slider2");
	if (objSlider2 != null)
	{
		objSlider2.max = new Date().getFullYear();
		objSlider2.value = strEndYear;
	}
	
	var sliderSections = document.getElementsByClassName("range-slider");
      for( var x = 0; x < sliderSections.length; x++ ){
        var sliders = sliderSections[x].getElementsByTagName("input");
        for( var y = 0; y < sliders.length; y++ ){
          if( sliders[y].type ==="range" ){
            sliders[y].oninput = getVals;
            // Manually trigger event first time to display values
            sliders[y].oninput();
          }
        }
      }
}