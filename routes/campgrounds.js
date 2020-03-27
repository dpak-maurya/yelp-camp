var express=require('express');
var router=express.Router();
var Campground=require('../models/campground');

//Index : Show all Campgrounds
router.get("/", function(req, res) {
  Campground.find({}, function(err, campgrounds) {
    if (err) console.log();
    else {
      res.render("campgrounds/index", { campgrounds: campgrounds });
    }
  });
});

//Campgronds Create
router.post("/",isLoggedin, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var author={
    id:req.user._id,
    username:req.user.username
  }
  var newCampground = { name: name, image: image, description: desc,author:author };
  console.log(req.user);
  Campground.create(newCampground, function(err, camp) {
    if (err) console.log(err);
    else {
      console.log(camp);
      res.redirect("/campgrounds");
    }
  });
});
//Campground New
router.get("/new", isLoggedin,function(req, res) {
  res.render("campgrounds/new");
});

//INDEX : Show all Campgrounds
router.get("/:id", function(req, res) {
  Campground.findById(req.params.id)
    .populate("comments")
    .exec(function(err, foundCamp) {
      if (err) {
        console.log(err);
      } else {
        res.render("campgrounds/show", { campground: foundCamp });
      }
    });
});
//MiddleWare
function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}
module.exports=router;