const mongoose = require("mongoose");
const date = require("./date")

//mongoose.connect('mongodb://localhost/wikipedia', { useNewUrlParser: true }, function(){
//    console.log('mongodb connected')
//});

// mongoose.connect('mongodb://briskwikipedia:3201@ec2-3-212-186-203.compute-1.amazonaws.com:27017/wikipedia', { useNewUrlParser: true }, function(){
//     console.log('mongodb connected')
// });

let revSchema = new mongoose.Schema({
    title: String,
    timestamp:String,
    user:String,
    user_type:String,
    anon:String
},{
    versionKey: false
});

let overallDataSchema = new mongoose.Schema({
    year:String,
    admin_active:Number,
    admin_former:Number,
    admin_inactive:Number,
    admin_semi_active:Number,
    anon:Number,
    bot:Number,
    regular:Number,
    hidden:Number,
    lastEditTime:String
})

var Revision = mongoose.model('Revision', revSchema, 'revisions');

var OverallInfo = mongoose.model('OverallInfo', overallDataSchema, 'overallInfo');

revSchema.index({timestamp:1});

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
            "anon": obj.anon,
            "hidden":obj.hidden,
            "regular":obj.regular,
            "lastEditTime":date.currentTime()}}
    OverallInfo.update({"year":obj.year},setOptions,{upsert:true}).exec(function (err) {
        if (err){
            console.log(err);
        }
    });
}

async function create(){
    for (let year = 2001;year<=date.currentYear();year++){
        const temp = await overall_analytics_get_year_dataAsync(year);
        //console.log(temp);
        updateDataInOverAllCollection(temp);
    }
    let overall = await overall_analytics_get_total_numberAsync();
    updateDataInOverAllCollection(overall);
    let title = await overall_analytics_get_revisionNum_of_each_typeAsync();
    console.log(title);
    updateDataInOverAllCollection(title);

}
create();