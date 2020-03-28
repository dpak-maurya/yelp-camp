var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    User                  = require("./models/user"),
    methodOverride        =require('method-override'),
    flash                 =require('connect-flash'),
    Campground            = require("./models/campground"),
    Comment               = require("./models/comment"),
    seedDB                = require("./seeds");

//Requiring Routes
var commentRoutes         =require('./routes/comments'),
    campgroundRoutes      =require('./routes/campgrounds'),
    indexRoutes           =require('./routes/index');

// mongoose.connect("mongodb://localhost/YelpCamp", {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false
// });
mongoose.connect(process.env.DATABASEURL,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex:true
}).then(()=>{
  console.log('Connected to DB!');
}).catch(err=>{
  console.log('ERROR:',err.message);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
//seedDB();
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(flash());

app.use(
  require("express-session")({
    secret: "Corona virus has spread all over the world",
    resave: false,
    saveUninitialized: false
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error=req.flash('error')
  res.locals.success=req.flash('success');
  next();
});

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use( "/campgrounds/:id/comments",commentRoutes);

app.listen(8000, function() {
  console.log("server started");
});
