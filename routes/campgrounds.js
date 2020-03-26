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
router.post("/", function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var desc = req.body.description;
  var newCampground = { name: name, image: image, description: desc };
  Campground.create(newCampground, function(err, camp) {
    if (err) console.log(err);
    else {
      res.redirect("/campgrounds");
    }
  });
});
//Campground New
router.get("/new", function(req, res) {
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