//Campground model
var mongoose = require("mongoose");

var campgroundSchema = new mongoose.Schema({
   name: String,
   price:String,
   img: String,
   description: String,
   location: String,
   lat: Number,
   lng: Number,
   comments: [
      {
         type: mongoose.Schema.Types.ObjectId,
         ref: "Comment"
      }
   ],
   author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
   createdAt:
   { type:Date,default:Date.now},
   
   
   updatedAt:
   { type:Date,default:Date.now}
   
});

module.exports = mongoose.model("Campground", campgroundSchema);

