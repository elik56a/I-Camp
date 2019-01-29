var express =require("express");
var router = express.Router();
var Campground =require("../models/campground");
var middleWareObj = require("../middleware");


//INDEX -show all campgrounds
router.get("/", function(req,res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
    
        }else{
         res.render("campgrounds/index", {campgrounds:allCampgrounds})  
        }
    })
  
})


// NEW - show form to create new campground
router.get("/new", middleWareObj.isLogedIn, function(req, res) {
    res.render("campgrounds/new");
});


//CREATE- add new camp to DB
router.post("/",middleWareObj.isLogedIn, function(req,res){
    var name= req.body.name;
    var price=req.body.price;
    var img= req.body.img;
    var author={
        id: req.user._id,
        username: req.user.username
    }
    var description= req.body.description;
    var newCamp = {name: name,price:price, img:img, description:description, author:author}
    Campground.create(newCamp,function(err,newCreated){
        if(err){
            console.log(err)
        }
        else{
        req.flash("success","Your Create New Camp!")
          res.redirect("/campgrounds");
        }
    })
 
})



//SHOW - more info about specific campground
router.get("/:id", function(req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err || !foundCampground){
        req.flash("error","Camp not found")
        res.redirect("back")
        }else{
          res.render("campgrounds/show",{ campground: foundCampground});
        }
    })
    
})

//Edit
router.get("/:id/edit",middleWareObj.chekCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    });
    
    
});//Update
router.put("/:id", middleWareObj.chekCampgroundOwnership, function(req, res){
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, blog){
       if(err){
           res.redirect("/campgrounds");
       } else {
          req.flash("success","The camp was successfully updeted!")
         res.redirect("/campgrounds/" + req.params.id);
       }
   });
});

//Delete campground.
router.delete("/:id",middleWareObj.chekCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/campgrounds")
        } else {
          req.flash("success","The camp was successfully deleted!")
            res.redirect("/campgrounds")
        }
    })
})








module.exports=router;