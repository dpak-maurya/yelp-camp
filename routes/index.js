var express=require('express');
var router=express.Router();
var passport=require('passport');
var User=require('../models/user');

router.get("/", function(req, res) {
  res.render("landing");
});

//show register form
router.get("/register", function(req, res) {
  res.render("register");
});

router.post("/register", function(req, res) {
  var newUser = new User({ username: req.body.username });
  User.register(newUser, req.body.password, function(err, user) {
    if (err) {
      req.flash('error',err.message);
      res.redirect('/register');
    }
    else{
      passport.authenticate("local")(req, res, function() {
        req.flash('success','Welcome to YelpCamp '+user.username);
        res.redirect("/campgrounds");
      });
    }
    
  });
});

//Show Login Form
router.get("/login", function(req, res) {
  res.render("login");
});

//Loging Handling 
router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/campgrounds",
    failureRedirect: "/login",
    failureFlash:true,
    successFlash:'Successfull Sign in'
  }),
  function(req, res) {
  }
);
//Logout 
router.get("/logout", function(req, res) {
  req.logout();
  req.flash('success','successfully logged out');
  res.redirect("/campgrounds");
});

module.exports=router;