function button_add_clicked()
{
	// disable the button
	document.getElementById("AddArticleFormButtonAdd").disabled = true;

	// step 1
	validate_user_input();
}

var g_url = null;

function button_download_log_clicked()
{
	// release the memory before reallocate
	if (g_url != null)
	{
		window.URL.revokeObjectURL(g_url);
		g_url = null;
	}

	var objTextarea = document.getElementById("AddArticleFormTextArea");
	if (objTextarea == null)
	{
		return;
	}

	var text = objTextarea.value;
	var data = new Blob([text], {type: 'text/plain'});
	g_url = window.URL.createObjectURL(data);

	document.getElementById('AddArticleFormLinkDownloadLog').href = g_url;

	// simulate the clicking
	document.getElementById('AddArticleFormLinkDownloadLog').click();
}

function validate_user_input()
{
	if (document.getElementById("AddArticleFormTextInputArticleTitle").value.length == 0)
	{
		display_textarea_msg("Error: Please input the article title!");
		display_textarea_input_waiting_indication();
		return;
	}

	// step 2
	check_if_article_already_exist();
}

function check_if_article_already_exist()
{
	display_textarea_msg("Checking our database...");

	$.getJSON('/getData?FunId=individual_article_analytics_get_entire_title_listAsyn', {paramNum: 0}, function(rdata) {

		var objInputText = document.getElementById("AddArticleFormTextInputArticleTitle");
		var strInput = objInputText.value;


		if (rdata.titles.includes(strInput))
		{
			display_textarea_msg("Error: This article already exists in our database!");
			display_textarea_input_waiting_indication();
			return;
		}

		// step 3
		check_if_article_really_exists(strInput);
	});
}

function check_if_article_really_exists(strArticleTitle)
{
	display_textarea_msg("Checking WikiPedia's database...");

	$.getJSON('/getData?FunId=miscellaneous_trying_fetch_first_data_from_wikipedia&Param1=' + strArticleTitle,
		{paramNum: 1}, function(rdata) {

			var nUpdatedRevisions = rdata.revisions_updated;

			if (nUpdatedRevisions == -1)
			{
				display_textarea_msg("Error: There is no article named \"" + strArticleTitle + "\" in WikiPedia!");
				display_textarea_input_waiting_indication();
				return;
			}
			else if (nUpdatedRevisions != 1)
			{
				display_textarea_msg("Error: Program should never be here!");
				display_textarea_input_waiting_indication();
				return;
			}

			display_textarea_msg("Article \"" + strArticleTitle + "\" entry was successfully established! Start fetching all revisions from WikiPedia...");

			// step 4
			fetch_entire_revision_data_from_wikipedia(strArticleTitle, 1, 1);

		});
}

function fetch_entire_revision_data_from_wikipedia(strArticleTitle, nSerial, nSum)
{
	display_textarea_msg("Start the No." + nSerial.toString() + " fetching attempt of article \"" + strArticleTitle + "\"... Already collected revisions: " + nSum.toString() + " ...");
	$.getJSON('/getData?FunId=miscellaneous_fetch_data_from_wikipedia&Param1=' + strArticleTitle +
		'&Param2=' + "0" + '&Param3=' + "Latest",
		{paramNum: 3}, function(rdata) {
			var nUpdatedRevisions = rdata.revisions_updated;
			if (nUpdatedRevisions == 499)
			{
				fetch_entire_revision_data_from_wikipedia(strArticleTitle, nSerial+1, nSum + nUpdatedRevisions);
			}
			else
			{
				display_textarea_msg("Finished the fetching of article \"" + strArticleTitle + "\"... The count of revisons: " + (nSum + nUpdatedRevisions).toString() + " .");
				display_textarea_msg("You can input the next article title now. Thank you for your contribution!");
				display_textarea_input_waiting_indication();
			}

		});

}

function display_textarea_input_waiting_indication()
{
	// display the UI indicating message:
	var objTextarea = document.getElementById("AddArticleFormTextArea");
	objTextarea.value += "\r\n" + "[" + (new Date()).toString().substr(0, 24) + "] " + "Now waiting for your text input...\r\n";
	objTextarea.scrollTop = objTextarea.scrollHeight;

	document.getElementById("AddArticleFormButtonAdd").disabled = false;
}

function display_textarea_msg(strMsg)
{
	// display the UI indicating message:
	var objTextarea = document.getElementById("AddArticleFormTextArea");
	if (objTextarea != null)
	{
		objTextarea.value += "[" + (new Date()).toString().substr(0, 24) + "] " + strMsg;
		objTextarea.value += "\r\n";
		objTextarea.scrollTop = objTextarea.scrollHeight;
	}
}

// entry point
window.onload = function()
{
	// check user session (only signed-in user can add article)
	// $.getJSON('/getData?FunId=miscellaneous_get_session_user_stauts', {paramNum: 0}, function(rdata) {
	// 	var objButton = document.getElementById("AddArticleFormButtonAdd");
	//
	// 	//if (rdata["user_status"] == "signed-in")
	// 	{
	// 		objButton.onclick = button_add_clicked;
	// 		display_textarea_input_waiting_indication();
	// 	}
	// 	else
	// 	{
	// 		objButton.disabled = true;
	// 		display_textarea_msg("Error: You must log in first!");
	// 	}
	// });

	var objButtonAdd = document.getElementById("AddArticleFormButtonAdd");
	objButtonAdd.onclick = button_add_clicked;

	var objButtonDownloadLog = document.getElementById("AddArticleFormButtonDownloadLog");
	objButtonDownloadLog.onclick = button_download_log_clicked;

	document.getElementById("AddArticleFormButtonGoBack").onclick = function (){window.history.back();};


	display_textarea_input_waiting_indication();

}