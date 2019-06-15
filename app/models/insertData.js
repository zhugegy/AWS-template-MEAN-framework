const schema = require("./createCollections");

let Revision = schema.Revision;

module.exports.insertRevisionsData = function(array) {
        for(let i=0; i<array.length;i++){
            let temp = new Revision(array[i]);
//            temp.save(function (err,res) {
//                if(err){
//                    console.log(err);
//                }
//            });
            temp.save();
        }
}

