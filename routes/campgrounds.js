var express =require("express");
var router = express.Router();
var Campground =require("../models/campground");
var middleWareObj = require("../middleware");

var NodeGeocoder = require('node-geocoder');
 
var options = {
  provider: 'google',
  httpAdapter: 'https',
  apiKey: process.env.GEOCODER_API_KEY,
  formatter: null
};
 
var geocoder = NodeGeocoder(options);
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
router.post("/", middleWareObj.isLogedIn, function (req, res) {
    var name = req.body.name;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }   
    var price = req.body.price;
    var img = req.body.img;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data[0].latitude;
        var lng = data[0].longitude;
        var location = data[0].formattedAddress;
        var newCampground = { name: name, img: img,  price:price, description: description, author: author, location: location, lat: lat, lng: lng ,};
        // Create a new campground and save to DB
        Campground.create(newCampground, function (err, newlyCreated) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to campgrounds page
                console.log(newlyCreated);
                res.redirect("/campgrounds");
            }
        });
    });
});



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
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || !data.length) {
          req.flash('error', 'Invalid address');
          return res.redirect('back');
        }
        req.body.campground.lat = data[0].latitude;
        req.body.campground.lng = data[0].longitude;
        req.body.campground.location = data[0].formattedAddress;
   Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, blog){
       if(err){
           res.redirect("/campgrounds");
       } else {
          req.flash("success","The camp was successfully updeted!")
         res.redirect("/campgrounds/" + req.params.id);
        }
    });
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