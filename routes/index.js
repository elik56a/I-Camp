var express =require("express");
var router = express.Router();
var User = require("../models/user");
var passport = require("passport");

//root route
router.get("/", function(req,res){
   res.render("landing");
});

// AUTH ROUTS
//register form
router.get("/register", function(req, res) {
    res.render("register");
});

// Sing Up
router.post("/register", function(req,res){
    var newUser =new User({username:req.body.username});
    if(req.body.adminCode==="admincode101"){
       newUser.isAdmin=true;
    }
    User.register(newUser,req.body.password,function(err, user){
        if(err){
            req.flash("error",err.message)
            return res.render("register");
           }
            passport.authenticate("loacl")(req, res, function(){
                req.flash("success","Welcome!Nice To meet you " + user.username)
                 res.redirect("/campgrounds");
        });   
    });
});

//LOGIN- SHOW LOGIN FORM
router.get("/login", function(req, res) {
    res.render("login");
});


//login logic
router.post("/login", passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login"
}) ,function(req, res){
});

//Log out
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success","Log you out")
    res.redirect("/campgrounds");
})


module.exports=router;
