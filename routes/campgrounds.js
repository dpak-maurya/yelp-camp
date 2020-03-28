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
router.get('/:id/edit',checkCampgroundOwnership, function(req,res){
 
    Campground.findById(req.params.id,function(err,foundCampground){
        
          res.render('campgrounds/edit',{campground:foundCampground});
    }); 
});
router.put('/:id',checkCampgroundOwnership,function(req,res){
  
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
      res.redirect('/campgrounds');
    }else{
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});
router.delete('/:id',checkCampgroundOwnership,function(req,res){
  // res.send('you are trying to delete');
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect('/campgrounds');
    }else{
      res.redirect('/campgrounds');
    }
  })
})

//MiddleWare
function checkCampgroundOwnership(req,res,next){
  if(req.isAuthenticated()){
    Campground.findById(req.params.id,function(err,foundCampground){
      if(err){
        res.redirect('back');
      }else{
        if(foundCampground.author.id.equals(req.user._id)){
          next();
        }
        else{
          res.redirect('back');
        }
        }
    }); 
  }
  else{
    res.redirect('back');
  }
}

function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.redirect("/login");
}
module.exports=router;