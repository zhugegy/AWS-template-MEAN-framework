const schema = require("./createCollections");
const date = require("./date");

let Revision = schema.Revision;
let OverallInfo = schema.OverallInfo;

function overall_analytics_get_total_numberAsync(){
    const aggregatorOpts = [
        {
            $group: {
                _id: '$user_type',
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
            let resultObj = {year:"overall",
                admin_active:0,
                admin_former:0,
                admin_inactive:0,
                admin_semi_active:0,
                anon:0,
                bot:0,
                regular:0,
                hidden:0,
                lastEditTime: date.currentTime()
                }
            for(let i=0;i<results.length;i++){
                transformObject(resultObj,results[i]);
            }
            resolve(resultObj);



        });
    });
    return p;
}

function overall_analytics_get_year_dataAsync(year){
    var startYear = year.toString();
    var endYear = (year+1).toString();
    const aggregatorOpts = [
        {$match:{
                "timestamp":{$gt:startYear,"$lt":endYear}
            }
        },
        {
            $group: {
                _id: '$user_type',
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
            let resultObj = {year:startYear,
                admin_active:0,
                admin_former:0,
                admin_inactive:0,
                admin_semi_active:0,
                anon:0,
                bot:0,
                regular:0,
                hidden:0,
                lastEditTime:date.currentTime()}
            for(let i=0;i<results.length;i++){
                transformObject(resultObj,results[i]);
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

function updateDataInOverAllCollection(obj){
    let setOptions = {$set:{"admin_active":obj.admin_active,
                            "admin_inactive":obj.admin_inactive,
                            "admin_former":obj.admin_former,
                            "admin_semi_active":obj.admin_semi_active,
                            "bot":obj.bot,
                            "hidden":obj.hidden,
                            "regular":obj.regular,
                            "lastEditTime":date.currentTime()}}
    OverallInfo.update({"year":obj.year},setOptions,{upsert:true}).exec(function (err) {
        if (err){
            console.log(err);
        }
    });
}

module.exports.checkOverallInfo = async function (){
    for (let year = 2001;year<=date.currentYear();year++){
        const temp = await overall_analytics_get_year_dataAsync(year);
        updateDataInOverAllCollection(temp);
    }
    let overall = await overall_analytics_get_total_numberAsync();
    updateDataInOverAllCollection(overall);
}