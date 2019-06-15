var mongoose = require("mongoose");
//var userArray = require("./userArrary");
//var date = require("./date");

mongoose.connect('mongodb://localhost/wikipedia', { useNewUrlParser: true }, function(){
    console.log('mongodb connected W')
});
var revSchema = new mongoose.Schema({
    title: String,
    timestamp:String,
    user:String,
    anon:String
},{
    versionKey: false
});


revSchema.index({timestamp:1});

var Revision = mongoose.model('Revision', revSchema, 'revisions');

/*
Revision.find({user:{$in:["InternetArchiveBot"]}}).exec(function (err,results) {

    if(err){
        console.log(err);
    }
    console.log(results.length);
});
Revision.count({user:{$in:[]}}).exec(function (err,results) {

    if(err){
        console.log(err);
    }
    console.log(results);
});*/



/*Revision.count({user:{$in:userArray.admin_semi_active}}).exec(function(err,count){
    if(err){
        console.log(err);
    }
    console.log(count);
});
*/





module.exports.overall_analytics_get_n_titles_with_most_revisionsAsync = function (strRankNumber) {
	console.log("lai lai lai");
	
    const aggregatorOpts = [
        {
            $group: {
                _id: '$title',
                count: { $sum: 1 }
            }
        },
        {$sort: {"count":-1}},
        {$limit:2}
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

module.exports.overall_analytics_get_n_titles_with_least_revisionsAsync = function (strRankNumber) {
    const aggregatorOpts = [
        {
            $group: {
                _id: '$title',
                count: { $sum: 1 }
            }
        },
        {$sort: {"count":1}},
        {$limit:2}
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

function overall_analytics_get_title_with_most_unique_usersAsync(){
    const aggregatorOpts = [
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
            var count=results[0].count;

            let resultsObj = {title,count};

            resolve(resultsObj);


        });
    });
    return p;


}

function overall_analytics_get_title_with_least_unique_usersAsync(){
    const aggregatorOpts = [
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
            var count=results[0].count;

            let resultsObj = {title,count};

            resolve(resultsObj);


        });
    });
    return p;


}

module.exports.overall_analytics_top_two_title_with_longest_historyAsync = function () {
    const aggregatorOpts = [
        {
            $group: {
                "_id": {"title": '$title'},
                timestamp: {$min:"$timestamp"}
            }

        },

        {$sort: {"timestamp":-1}},
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

function overall_analytics_top_two_title_with_shortest_historyAsync() {
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



/**
async function upAll(){
    const res1 = await overall_analytics_get_n_titles_with_most_rivisionsAsync(2);
    const res2 = await overall_analytics_get_n_titles_with_least_rivisionsAsync(2);
    const res3 = await overall_analytics_get_title_with_most_unique_usersAsync();
    const res4 = await overall_analytics_get_title_with_least_unique_usersAsync();
    const res5 = await overall_analytics_top_two_title_with_longest_historyAsync();
    const res6 = await overall_analytics_top_two_title_with_shortest_historyAsync();
    console.log(res6);
}
upAll();
 **/