var Campground=require("../models/campground")
var Comment=require("../models/comments")
var middleWareObj ={};

//MiddleWere too check if user own the campgrund:
middleWareObj.chekCampgroundOwnership= function (req,res,next){
 if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(err, foundCampground){
           if(err|| !foundCampground){
                req.flash("error","Camp not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)|| req.user.isAdmin) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
         req.flash("error","You need to be logged in to do that!")
        res.redirect("back");
    }
};
//MiddleWere too check if user own the comment:
middleWareObj.chekCommentOwnership= function (req,res,next){
 if(req.isAuthenticated()){
     
        Comment.findById(req.params.comments_id, function(err, foundComment){
           if(err || !foundComment){
            req.flash("error","Comment not found")
               res.redirect("back");
           }  else {
               // does user own the campground?
            if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
                next();
            } else {
                res.redirect("back");
            }
           }
        });
    } else {
         req.flash("error","You need to be logged in to do that!")
        res.redirect("back");
    }
};

// MiddleWere too check if someone is log in
middleWareObj.isLogedIn= function isLogedIn(req,res,next){
    if(req.isAuthenticated() ){
        return next()
    }
    req.flash("error","You need to be logged in to do that!")
    res.redirect("/login");
};

module.exports = middleWareObj;