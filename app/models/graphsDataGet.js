const date = require("./date");
const schema = require("./createCollections");

let OverallInfo= schema.OverallInfo;
let Revision = schema.Revision;



module.exports.overall_analytics_get_user_distributionAsync = function(year){
    var year = year.toString();
    const p = new Promise((resolve, reject) => {
        OverallInfo.find({"year":year}).exec(function (err,result) {
            if(err){
                console.log(err);
            }
            resolve(result[0]);
        });
    });
    return p;
}

module.exports.individual_article_analytics_get_user_distribution_Async = function(startYear,title){
    let aggregatorOpts = []
    if(startYear!="overall"){
        var endYear = (parseInt(startYear)+1).toString();
        aggregatorOpts = [
            {   $match:{"timestamp":{$gt: startYear,$lt: endYear},
                        "title":title}},
            {$group: {
                    _id: '$user_type',
                    count: { $sum: 1 }
                }
             },
            {$sort: {"_id":1}}
        ];
    }
    else {
        aggregatorOpts = [
            {$match:{
                    "title":title}},
            {$group: {
                    _id: '$user_type',
                    count: { $sum: 1 }
                }
            },
            {$sort: {"_id":1}}
        ];
    }

    const p = new Promise((resolve, reject) => {
        Revision.aggregate(aggregatorOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }
            let resultObj = {year:startYear,
                admin_active:0,
                admin_former:0,
                admin_inactive:0,
                admin_semi_active:0,
                anon:0,
                bot:0,
                regular:0,
                hidden:0,
            }
            for(let i=0;i<results.length;i++){
                transformObject(resultObj,results[i]);
            }
            resolve(resultObj);
        });
    });
    return p;
}

module.exports.individual_article_analytics_get_user_distributionAsync = function (startYear,user,title) {
    var endYear = (parseInt(startYear)+1).toString();
    const countOpts = {"timestamp":{$gt: startYear,$lt: endYear},
                "title":title,
                "user":user};
    const p = new Promise((resolve, reject) => {
        Revision.count(countOpts).exec(function (err,results) {
            if(err){
                console.log(err);
            }
            let resultObj = {year:startYear,
                revision_number: results
            }
            resolve(resultObj);
        });
    });
    return p;
    
}


function transformObject(Obj1,Obj){
    switch(Obj._id)
    {
        case "admin_active":
            Obj1.admin_active = Obj.count;
            break;
        case "admin_former":
            Obj1.admin_former = Obj.count;
            break;
        case "admin_inactive":
            Obj1.admin_inactive = Obj.count;
            break;
        case "admin_semi_active":
            Obj1.admin_semi_active = Obj.count;
            break;
        case "anon":
            Obj1.anon = Obj.count;
            break;
        case "bot":
            Obj1.bot = Obj.count;
            break;
        case "hidden":
            Obj1.hidden = Obj.count;
            break;
        default:
            Obj1.regular = Obj.count;
    }

}