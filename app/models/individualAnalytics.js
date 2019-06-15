var mongoose = require("mongoose");
const schema = require("./createCollections");

let Revision = schema.Revision;

module.exports.individual_article_find_latest_timeAsync = function(title){
    const aggregatorOpts = [
        {$match:{
                "title":title
            }
        },
        {$sort: {"timestamp":-1}},
        {$limit:1}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            resolve({last_timestamp:results[0].timestamp});


        });
    });
    return p;
}

module.exports.individual_article_analytics_get_title_contributing_infoAsync = function(title,number,startYear,endYear){
//	if (startYear == endYear)
//	{
//		endYear = (parseInt(endYear) + 1).toString();
//	}
	
	number = parseInt(number);
	const aggregatorOpts = [
        {$match:{
        	"user_type":"regular",
            "title":title,
        "timestamp":{$gt: startYear,$lt: endYear}}
        },
        {
            $group: {
                _id: '$user',
                count: { $sum: 1 }
            }
        },
        {$sort: {"count":-1}},
        {$limit:number}
    ];
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            var contributing_user_lst =  new Array();
            var revision_number_lst = new Array();
            
            for (let i=0;i<results.length;i++){
                contributing_user_lst.push(results[i]._id);
                revision_number_lst.push(results[i].count);
            }
            let resultsObj = {title,contributing_user_lst,revision_number_lst}

            resolve(resultsObj);


        });
    });
    return p;
}


module.exports.individual_article_analytics_get_title_infoAsync = function(title,startYear,endYear){
//	if (startYear == endYear)
//	{
//		endYear = (parseInt(endYear) + 1).toString();
//	}
	
	const p = new Promise((resolve, reject) => {
        Revision.count({"title":title,"timestamp":{$gt:startYear,$lt:endYear}}).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            var revisions=results;
            
            resolve({revisions});


        });
    });
    return p;
}

/**
async function upAll(){
    const res1 = await individual_article_find_latest_timeAsync("Canada");
    return res1;
}

var s = upAll();
console.log(s);
 */