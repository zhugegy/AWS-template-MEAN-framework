const mongoose = require("mongoose");


const schema = require("./createCollections");

let Revision = schema.Revision;

module.exports.author_analytics_get_author_infoAsync = function(user){
    const aggregatorOpts = [
        {$match:{
                "user":user
            }
        },
        {
            $group: {
                _id: '$title',
                count: { $sum: 1 }
            }
        },
        {$sort: {"_id":1}}
    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }
            var contributed_article_lst =  new Array();
            var revision_number_lst = new Array();
            for (let i=0;i<results.length;i++){
                contributed_article_lst.push(results[i]._id);
                revision_number_lst.push(results[i].count);
            }
            let resultsObj = {contributed_article_lst ,revision_number_lst}
            resolve(resultsObj);


        });
    });
    return p;
}

module.exports.author_analytics_get_author_with_article_infoAsync = function(user,title) {
    const aggregatorOpts = [
        {$match: {
                "user":user,
                "title":title
            }},
        {$group:{
                _id:"$timestamp",
                count: {$sum:1}

            }},
        {$sort: {"_id":-1}}

    ]
    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }

            var revision_number=0;
            var revision_time= new Array();
            for (let i=0;i<results.length;i++){
                revision_time.push(results[i]._id);
                revision_number += results[i].count;
            }
            let resultsObj = {revision_number,revision_time}

            resolve(resultsObj);


        });
    });
    return p;
}

/**
async function upAll(){
    const res1 = await author_analytics_get_author_with_article_infoAsyn("Begoon","Austrilia");
    console.log(res1);
}

upAll();

**/

