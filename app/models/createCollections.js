const connectDB = require("./connectDB");
const mongoose = require("mongoose");

var revSchema = new mongoose.Schema({
    title: String,
    timestamp:String,
    user:String,
    user_type:String,
    anon:String
},{
    versionKey: false
});

var overallDataSchema = new mongoose.Schema({
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

module.exports.Revision = Revision;
module.exports.OverallInfo = OverallInfo;