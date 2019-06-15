const schema = require("./createCollections");

let Revision = schema.Revision;


module.exports.overall_analytics_get_n_titles_with_most_revisionsAsync = function (strRankNumber) {
    strRankNumber = parseInt(strRankNumber);
    const aggregatorOpts = [
        {
            $group: {
                _id: '$title',
                count: { $sum: 1 }
            }
        },
        {$sort: {"count":-1}},
        {$limit:strRankNumber}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            var title_lst =  new Array();
            var revision_number_lst = new Array();
            for (let i=0;i<strRankNumber;i++){
                title_lst.push(results[i]._id);
                revision_number_lst.push(results[i].count);
            }
            let resultsObj = {title_lst,revision_number_lst}

            resolve(resultsObj);


        });
    });
    return p;
}

module.exports.overall_analytics_get_n_titles_with_least_revisionsAsync = function (strRankNumber){
    strRankNumber = parseInt(strRankNumber);
    const aggregatorOpts = [
        {
            $group: {
                _id: '$title',
                count: { $sum: 1 }
            }
        },
        {$sort: {"count":1}},
        {$limit:strRankNumber}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            var title_lst =  new Array();
            var revision_number_lst = new Array();
            for (let i=0;i<strRankNumber;i++){
                title_lst.push(results[i]._id);
                revision_number_lst.push(results[i].count);
            }
            let resultsObj = {title_lst,revision_number_lst}

            resolve(resultsObj);


        });
    });
    return p;

}

module.exports.overall_analytics_get_title_with_most_unique_usersAsync = function (){
    const aggregatorOpts = [
    	{$match:{
			"user_type":{$ne:"anon"}
    	}},
        {
            $group: {
                "_id": {"title": '$title',"user":"$user"}
            }

        },
        {
            $group: {
                "_id": {"title":'$_id.title'},
                count: { $sum: 1 }
            }

        },
        {$sort: {"count":-1}},
        {$limit:1}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err) {
                console.log(err);
            }
            var title=results[0]._id.title;
            var user_count=results[0].count;

            let resultsObj = {title,user_count};

            resolve(resultsObj);


        });
    });
    return p;


}

module.exports.overall_analytics_get_title_with_least_unique_usersAsync = function(){
    const aggregatorOpts = [
    	{$match:{
    			"user_type":{$ne:"anon"}
    	}},
        {
            $group: {
                "_id": {"title": '$title',"user":"$user"}
            }

        },
        {
            $group: {
                "_id": {"title":'$_id.title'},
                count: { $sum: 1 }
            }

        },
        {$sort: {"count":1}},
        {$limit:1}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err) {
                console.log(err);
            }
            var title=results[0]._id.title;
            var user_count=results[0].count;

            let resultsObj = {title,user_count};

            resolve(resultsObj);


        });
    });
    return p;


}

module.exports.overall_analytics_top_two_title_with_longest_historyAsync = function(){
    const aggregatorOpts = [
        {
            $group: {
                "_id": {"title": '$title'},
                timestamp: {$min:"$timestamp"}
            }

        },

        {$sort: {"timestamp":1}},
        {$limit:2}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            var title_lst =  new Array();
            var age_lst = new Array();
            for (let i=0;i<2;i++){
                title_lst.push(results[i]._id.title);
                age_lst.push(results[i].timestamp);
            }
            let resultsObj = {title_lst,age_lst}

            resolve(resultsObj);


        });
    });
    return p;
}

module.exports.overall_analytics_top_two_title_with_shortest_historyAsync = function() {
    const aggregatorOpts = [
        {
            $group: {
                "_id": {"title": '$title'},
                timestamp: {$min:"$timestamp"}
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

            var title = "";
            var age = "";
            
            title = results[0]._id.title;
            age = results[0].timestamp;

            let resultsObj = {title,age}

            resolve(resultsObj);


        });
    });
    return p;
}

module.exports.individual_article_analytics_get_entire_title_listAsync = function () {
    const aggregatorOpts = [
        {
            $group: {
                _id: '$title',
                count: { $sum: 1 }
            }
        },
    ];

    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }
            let resultObj = {
                titles:[],
                revisions:[]
            };
            for(let i=0;i<results.length;i++){
                resultObj.titles.push(results[i]._id);
                resultObj.revisions.push(results[i].count);
            }
            resolve(resultObj);
        });
    });
    return p;
}


/**
async function upAll(){
    const res1 = await overall_analytics_get_n_titles_with_most_rivisionsAsync(2);
    const res2 = await overall_analytics_get_n_titles_with_least_rivisionsAsync(2);
    const res3 = await overall_analytics_get_title_with_most_unique_usersAsync();
    const res4 = await overall_analytics_get_title_with_least_unique_usersAsync();
    const res5 = await overall_analytics_top_two_title_with_longest_historyAsync();
    const res6 = await overall_analytics_top_two_title_with_shortest_historyAsync();
    return
}
upAll();
 **/