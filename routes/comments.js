var express =require("express");
var router = express.Router({mergeParams:true});
var Campground =require("../models/campground");
var Comment   = require("../models/comments");
var middleWareObj = require("../middleware")

//Show Comment Form
router.get("/new", middleWareObj.isLogedIn, function(req, res) {
    Campground.findById(req.params.id, function(err,campground){
        if(err){
            console.log(err)
        } else {
            res.render("comments/new", {campground:campground})
        }
    })
   
})

//Craete New Comment

router.post("/",middleWareObj.isLogedIn, function(req,res){
    Campground.findById(req.params.id,function(err, campground) {
        if(err){
            console.log(err)
        } else{
              Comment.create(req.body.comment, function(err, comment) {
                  if(err){
                      console.log(err)
                  } else{
                  //add username and id to comment
                      comment.author.id = req.user._id;
                      comment.author.username = req.user.username;
                      //save comment
                     comment.save();
                    
                     console.log(req.user.username);
                     
                     campground.comments.push(comment);
                     campground.save();
                     console.log(comment)
                      req.flash("success","Thank you for your comment!")
                     res.redirect("/campgrounds/" +campground._id)
                  }
            });
        }
    });
});

//Edit Comment
router.get("/:comments_id/edit",middleWareObj.chekCommentOwnership, function(req,res){
         Campground.findById(req.params.id, function(err, foundCampground) {
        if(err|| !foundCampground){
         req.flash("error","Camp not found");
        return res.redirect("back")
        }
         Comment.findById(req.params.comments_id,function(err,foundComment){
        if(err){
            res.redirect("back")
        } else{
         res.render("./comments/edit",{campground_id:req.params.id, comment:foundComment})
        } 
      })
   })
})

//Update Comment
router.put("/:comments_id",middleWareObj.chekCommentOwnership,function(req,res){
    Comment.findByIdAndUpdate(req.params.comments_id, req.body.comment, function(err,updatedComment){
        if(err){
            res.redirect("back");
        } else {
               req.flash("success","Your comment has been successfully updated")
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete Comment
router.delete("/:comments_id",middleWareObj.chekCommentOwnership,function(req,res){
    Comment.findByIdAndRemove(req.params.comments_id,function(err){
        if(err){
            res.redirect("back")
        } else{
            req.flash("success","Your comment has been deleted")
            res.redirect("/campgrounds/"+ req.params.id)
        }
    })
})


module.exports=router;
