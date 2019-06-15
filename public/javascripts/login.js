$('.button_login1').click(function() {
	$('.button_login1').addClass('display_none');
	$('.form_login').removeClass('display_none');
});

function __showAlert(message, shortMsg="default", iconMsg="default", redictLink="/"){
	var message = message;
	$(".mask").removeClass('display_none');
	$(".alert_container").removeClass('display_none');
	$(".alert_content").html(message);
}

function showAlert(message, shortMsg="default", iconMsg="default", redictLink="/"){
	swal(shortMsg, message, iconMsg)
	.then((value) => {
		ajaxRedirect(redictLink);
		});
}

function __ajaxRedirect(link){
	var link = link;
	$("#close").click(function(){
		$(".mask").addClass('display_none');
		$(".alert_container").addClass('display_none');
		window.location.href = link;
	});	
}

function ajaxRedirect(link){
	var link = link;
	window.location.href = link;	
}

//Verify name format
function isName(name){
	var nameFormat = "[a-zA-Z]";
	if(!name == '' && name.match(nameFormat)){
		return true;
	}else{
		return false;
	}
}


//Verify email format
//required pattern="^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$"
function isEmail(email){
	//var emailFormat=/^(.+)@(.+)$/;
	var emailFormat=/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/;
	if(!email == '' && email.match(emailFormat)){
		return true;
	}else{
		return false;
	}
}

//Verify password
function isPassword(password){
	if(password == ''){
		return false;
	}else{
		return true;
	}
}


//log in
$('#login').click(function(){
	$.ajax({
		type: 'post',
		url: '/signin',
		data: {
			username: $('#username').val(),
			password: $('#password').val()
		},
		dataType: 'json',
		success: function (result){
			console.log(result);
			//if successful
			if(!result.code){
				setTimeout(function(){
					//go to the landing page as signed-in user
					console.log("ajax login sucess");
					var dataJson = JSON.stringify(result);
				    var jsonInfo = JSON.parse(dataJson);
					var message = jsonInfo.message;
					var isSuccess = jsonInfo.isSuccess;
					
					if(isSuccess){
						showAlert(message, "Authorization passed!", "success", "/");
						//close the alert window and redirect the landing page
						//ajaxRedirect("/");
					}else{
						//if log in is not success
						showAlert(message, "Authorization failed!", "error", "/login");
						//close the alert window and reload the login page
						//ajaxRedirect("/login");
					}
					
					//window.location.href = "/";
				},1000)
			}
		},
		error: function(result){
			console.log(result);
			console.log(XMLResponse.responseText);
		}
	})
});


//sign up
$('#signup').click(function(){	
	var firstname = $('#firstname').val();
	var lastname = $('#lastname').val();
	var username = $('#ai_username').val();
	var password = $('#ai_password').val();
	
	var i_firstname = $('.i_firstname');
	var i_lastname = $('.i_lastname');
	var i_email = $('.i_email');
	var i_password = $('.i_password');

	//verify the data
	if (isName(firstname)){
		if(!i_firstname.hasClass('display_none')){
			i_firstname.addClass('display_none');
		}		
	}else{
		if(i_firstname.hasClass('display_none')){
			i_firstname.removeClass('display_none');
		}		
	}

	if (isName(lastname)){
		if(!i_lastname.hasClass('display_none')){
			i_lastname.addClass('display_none');
		}		
	}else{
		if(i_lastname.hasClass('display_none')){
			i_lastname.removeClass('display_none');
		}		
	}

	if (isEmail(username)){
		if(!i_email.hasClass('display_none')){
			i_email.addClass('display_none');
		}		
	}else{
		if(i_email.hasClass('display_none')){
			i_email.removeClass('display_none');
		}		
	}

	if (isPassword(password)){
		if(!i_password.hasClass('display_none')){
			i_password.addClass('display_none');
		}		
	}else{
		if(i_password.hasClass('display_none')){
			i_password.removeClass('display_none');
		}		
	}

	
	if (isName(firstname) && isName(lastname) && isEmail(username) && isPassword(password)){
		$.ajax({
			type: "post",
			url: '/signup',
			data: {
				firstname: firstname,
				lastname: lastname,
				username: username,
				password: password
			},
			dataType: 'json',
			success: function (result){
			    var dataJson = JSON.stringify(result);
			    var jsonInfo = JSON.parse(dataJson);
				var message = jsonInfo.message;
				//if successful
				if(!result.code){
					setTimeout(function(){
						console.log("ajax sign up success");
						//alert the result
						if (message == "Sign up successfully. Please log in.")
						{
							showAlert(message, "Congratulations!", "success", "/login");
						}
						else
						{
							showAlert(message, "Sorry!", "error", "/login");
						}
						//close the alert window and reload the login page
						//ajaxRedirect("/login");
					},1000);
				}
			},
			error: function(result){
				console.log("ajax sign up falied");
				console.log(result);
				console.log(XMLResponse.responseText);
			}
		});
	}
});