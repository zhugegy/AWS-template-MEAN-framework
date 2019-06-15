let MongoClient = require('mongodb').MongoClient;
const connectionString = 'mongodb://localhost:27017';
const dbString = 'wikipedia';
const collectionString = 'revisions';

// 模版函数
// 需要暴漏给外界，即 module.exports.
// 参数：strTitleName 字符串类型，是title的名称，例如'BBC'
/*
	cotroller调用此函数的方法：
	var ModelOperations = require("../models/mongoDBTemplate")
	... ...
	Handler.template_function_get_the_B_who_did_most_revisons_of_a_title = async (param1, req, res) => {
		let objRes = await ModelOperations.template_function_get_the_B_who_did_most_revisons_of_a_title(param1, req, res);
		res.json(objRes);
	}
*/
module.exports.template_function_get_the_B_who_did_most_revisons_of_a_title = async (strTitleName) =>
{
	  let client = await MongoClient.connect(connectionString, { useNewUrlParser: true });
    let db = client.db(dbString);

    // 定义objTmp，它就是等会要给前端js的最终结果
    let objTmp;

    try {
			// 直接硬查，不用管什么Schema那些繁文缛节
			const result_1 = await db.collection(collectionString)
			.find({ "title": strTitleName})
			.sort({'timestamp':-1})
			.limit(1)
			.toArray();

			// 可以在此继续硬查更多需要的documents/counts:
			// const result_2 = await db.collection(collectionString).find...

			// 需要的东西都查到之后，构建objTmp
			objTmp =
			{
			 title: result_1[0]['title'],
			 user: result_1[0]['user']
			}
    }
    finally {
  		client.close();
      return objTmp;
    }
}


module.exports.overall_analytics_get_n_titles_with_most_revisions = async (strRankNumber) =>
{
	let objFake = {
			title_lst : ["USAF", "AustraliaF", "CanadaF", "AddF"], 
			revision_number_lst : [2001, 1981, 1971, 1611]
			};
	return objFake;
}

module.exports.overall_analytics_get_n_titles_with_least_revisions = async (strRankNumber) =>
{
	let objFake = {
			title_lst : ["USAlessF", "AustralialessF", "CanadalessF", "AddLessF"], 
			revision_number_lst : [21, 31, 41, 81]
			};
	return objFake;
}


module.exports.overall_analytics_get_title_with_most_unique_users = async () =>
{
	let objFake = {
			title : "USAF", 
			user_count : 201
	};
	return objFake;
}


module.exports.overall_analytics_get_title_with_least_unique_users = async () =>
{
	let objFake = {
			title : "CatF", 
			user_count : 21
	};
	return objFake;
}

module.exports.overall_analytics_top_two_title_with_longest_history = async () =>
{
	let objFake = {
			title_lst : ["cathF", "doghF"], 
			age_lst : ["10year 332daysF", "8year 22daysF"]
	};
	return objFake;
}


module.exports.overall_analytics_title_with_shortest_history = async () =>
{
	let objFake = {
			title : "mouseF", 
			age : "1year 332daysF"
	};
	return objFake;
}


module.exports.overall_analytics_get_drawsample = async () =>
{
	let objFake = {'NitrogenF': 0.78, 'OxygenF': 0.21, 'OtherF': 0.01};
	return objFake;
}


module.exports.individual_article_analytics_get_entire_title_listAsyn = async () =>
{
	let objFake = {
			titles: ["USA", "China", "Canada", "India"],
			revisions: [1001, 2001, 1501, 1001]

	};
	return objFake;
}

module.exports.individual_article_analytics_get_title_last_timestampAsy = async (strTitleName) =>
{
	let objFake = {
			last_timestamp: "2019-05-03T12:30:00Z"
	};
	return objFake;
}

module.exports.individual_article_analytics_get_title_infoAsync = async (strTitleName) =>
{
	let objFake = {
			revisions: 300
	};
	return objFake;
}

module.exports.individual_article_analytics_get_title_contributing_infoAsync = async (strTitleName, strUserCount) =>
{
	let objFake = {
			contributing_user_lst: ["Tom", "Tom2", "Tom3", "Tom4", "Tom5"], 
			revision_number_lst: [100, 90, 80, 20, 10]
	};
	return objFake;
}

module.exports.author_analytics_get_author_infoAsyn = async (strAuthorName) =>
{
	if (strAuthorName == "bucun")
	{
		let objFake = {
				contributed_article_lst : [], 
				revision_number_lst : []
		};
		return objFake;
	}
	
	let objFake = {
			contributed_article_lst : ["USA", "Cat", "Dog", "China", "Canada"], 
			revision_number_lst : [100, 90, 80, 20, 10]
	};
	return objFake;
}

module.exports.author_analytics_get_author_with_article_infoAsyn = async (strAuthorName, strTitleName) =>
{	
	let objFake = {
			revision_number: 3,
			revision_time : ["2001-1-1", "2001-1-6", "2003-1-1"]
	};
	return objFake;
}

module.exports.overall_analytics_get_user_distributionAsync = async (strYear) =>
{	
	let objFake = {
			year: '2019',
			 admin_active: 139,
			 admin_former: 8,
			 admin_inactive: 0,
			 admin_semi_active: 0,
			 anon: 120,
			 bot: 65,
			 regular: 2603,
			 hidden: 0,
			 lastEditTime: '2019-05-13 21:43:04'
	};
	return objFake;
}

