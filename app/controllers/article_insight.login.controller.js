/*
 * article_insight.login.controller.js
 * This controller module exposes two methods:
 * 
 */
var express = require('express');
var User = require('../models/User');
//encryption
var crypto = require("crypto");



//jump to the login page
module.exports.showPage= function(req, res){
	sess = req.session;
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess));
    res.render('login.ejs', {strGhostInfo: strGhostInfo});
}

//back to the landing page without log in
module.exports.backPage = function(req, res){
	strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
}

//sign in validation
module.exports.signIn = function(req, res){
	sess = req.session;
	var username = req.body.username;
	var orginPassword = req.body.password;
	var md5 = crypto.createHash("md5");
	var password = md5.update(orginPassword).digest("hex");
	//console.log(password);
	
	User.findUser(username, function (err, result){
		if(err){
			console.log("findUser Error");
		}else{
			if (result.length == 0) {
				res.send({isSuccess: false, message:'Cannot find this user'});
			}else if (result[0].Password == password) {
				//if log in sucessfully
				sess["user_status"] = "signed-in";
				sess["user_identification"] = username;
				strGhostInfo = JSON.stringify(construct_landing_page_meta_data(sess))
//			    res.render('landing.ejs', {strGhostInfo: strGhostInfo});
				res.send({isSuccess: true, message: 'Signed in successfully'});				
			}else if (result[0].password != password) {
				res.send({isSuccess: false, message: 'The password is incorrect.'});
			}
		}
	});
	
}


//sign up validation
module.exports.signUp = function(req,res){
	
	var firstname = req.body.firstname;
	var lastname = req.body.lastname;
	var username = req.body.username;
	var orginPassword = req.body.password;
	var md5 = crypto.createHash("md5");
	var password = md5.update(orginPassword).digest("hex");
	//console.log(password);
	
	User.findOne({
		Username: username
	}).then(function (result){
		if(result){
			//res.send({isSuccess: false, message: 'This username has been registed'});
			res.send({isSuccess: false, message: 'This email address has been already registered'});
			return;
		}	
		var aUser = new User({
			Firstname: firstname,
			Lastname: lastname,
			Username: username,
			Password: password
		});	
		return aUser.save();
	}).then(function(userInfo){
		//console.log(userInfo);
		res.json({isSuccess: true, message: 'Sign up successfully. Please log in.'});
		
	})
	
}



//chen
function construct_landing_page_meta_data(sess)
{
	var objMetaData = {};
	// todo sesssion check
	
	// case: not signed in
	objMetaData["user_status"] = "not-signed-in";
	objMetaData["user_identification"] = "Guest";
	
	// case: signed in
	//objMetaData["user_status"] = "signed-in";
	//objMetaData["user_identification"] = "zhugechenw@gmail.com";

	objMetaData["tab_name"] = "none"; //"overall_analytics";
	objMetaData["rank_range"] = 2;
	
	return restruct_landing_page_meta_data(objMetaData, sess);
}
//overwrite the originObj. If sess has the 
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

