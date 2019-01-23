//User model
var  mongoose    = require("mongoose");
var passportLoclMongoose = require("passport-local-mongoose");

var UserSchema= new mongoose.Schema({
    username:String,
    password:String,
    isAdmin:{type:Boolean, default:false}
});

UserSchema.plugin(passportLoclMongoose);


module.exports= mongoose.model("User", UserSchema);
