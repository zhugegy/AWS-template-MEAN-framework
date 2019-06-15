var mongoose = require('./connectDB');

//define the structure of user data
var userSchema = new mongoose.Schema({
	Firstname: String,
	Lastname: String,
	Username: String,
	Password: String
})

userSchema.statics.findUser = function(username, callback){
	return this
	.find({Username:username})
	.exec(callback)
}


var User = mongoose.model('User',userSchema, 'users')

module.exports = User;


