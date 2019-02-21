require('dotenv').config();
var express     = require("express"),
    app         = express(),
    mongoose    = require("mongoose"),
    passport    =require("passport"),
    LocalStrategy= require("passport-local"),
    User        = require("./models/user"),
    flash       = require("connect-flash"),
    bodyParser  = require("body-parser"),
    Campground  = require("./models/campground"),
    methodOverride = require("method-override"),
    Comment     = require("./models/comments");



mongoose.Promise = global.Promise;

// requring routes    
var commentsRoutes = require("./routes/comments") ;   
var campgroundRoutes = require("./routes/campgrounds");    
var indexRoutes = require("./routes/index")    


const port = process.env.PORT || 3000;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/i_camp');

app.use(bodyParser.urlencoded ({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname+"/public")); 
app.use(methodOverride("_method"));
app.use(flash());

//password conf
app.use(require("express-session")({
    secret: "abus",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use (new LocalStrategy (User.authenticate ()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// middlewere- user logout login singup at every page
app.use(function(req,res,next){
    res.locals.currentUser=req.user;
    res.locals.error =req.flash("error")
    res.locals.success =req.flash("success")
    app.locals.moment = require('moment');
    next();
})

app.use(indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentsRoutes);

app.listen(port, () => {
    console.log(`Started up at port ${port}`);
  });