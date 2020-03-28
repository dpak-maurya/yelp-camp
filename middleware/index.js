var Campground=require('../models/campground');
var Comment=require('../models/comment');
var middlewareObj = {};

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Campground.findById(req.params.id, function(err, foundCampground) {
      if (err) {
        req.flash('error','Campground not found');
        res.redirect("back");
      } else {
        if (foundCampground.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error',"you don't have person to do that")
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash('error','You need to be logged in to do that');
    res.redirect("back");
  }
};
middlewareObj.checkCommentOwnership = function(req, res, next) {
  if (req.isAuthenticated()) {
    Comment.findById(req.params.comment_id, function(err, foundComment) {
      if (err) {
        req.flash('error','comment not found');
        res.redirect("back");
      } else {
        if (foundComment.author.id.equals(req.user._id)) {
          next();
        } else {
          req.flash('error',"you don't have person to do that")
          res.redirect("back");
        }
      }
    });
  } else {
    req.flash('error','You need to be logged in to do that');
    res.redirect("back");
  }
};

middlewareObj.isLoggedin=function(req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash('error','You need to be logged in to do that');
    return res.redirect("/login");
  }

  module.exports=middlewareObj;
