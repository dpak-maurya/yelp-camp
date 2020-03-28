var express=require('express');
var router=express.Router();
var Campground=require('../models/campground');
var middleware=require('../middleware');

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
router.post("/",middleware.isLoggedin, function(req, res) {
  var name = req.body.name;
  var image = req.body.image;
  var price=req.body.price;
  var desc = req.body.description;
  var author={
    id:req.user._id,
    username:req.user.username
  }
  var newCampground = { name: name, image: image, price:price,description: desc,author:author };
  Campground.create(newCampground, function(err, camp) {
    if (err) console.log(err);
    else {
      console.log(camp);
      res.redirect("/campgrounds");
    }
  });
});
//Campground New
router.get("/new", middleware.isLoggedin,function(req, res) {

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
router.get('/:id/edit',middleware.checkCampgroundOwnership, function(req,res){
 
    Campground.findById(req.params.id,function(err,foundCampground){
        
          res.render('campgrounds/edit',{campground:foundCampground});
    }); 
});
router.put('/:id',middleware.checkCampgroundOwnership,function(req,res){
  
  Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,updatedCampground){
    if(err){
      res.redirect('/campgrounds');
    }else{
      res.redirect('/campgrounds/'+req.params.id);
    }
  });
});
router.delete('/:id',middleware.checkCampgroundOwnership,function(req,res){
  // res.send('you are trying to delete');
  Campground.findByIdAndRemove(req.params.id,function(err){
    if(err){
      res.redirect('/campgrounds');
    }else{
      req.flash('success','Campground deleted');
      res.redirect('/campgrounds');
    }
  })
})

module.exports=router;