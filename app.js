var express=require('express')
var app=express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');
var Campground=require('./models/campground');
var Comment=require('./models/comment');
var seedDB=require('./seeds');

mongoose.connect('mongodb://localhost/YelpCamp',{useNewUrlParser:true,useUnifiedTopology:true,useFindAndModify:false});
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
//seedDB();
app.use(express.static(__dirname+"/public"));

app.get('/',function(req,res){
	res.render("landing");
});
app.get('/campgrounds',function(req,res){
	Campground.find({},function(err,campgrounds){
		if(err) console.log();
		else{
			res.render("campgrounds/index",{campgrounds:campgrounds});
		}
	});
	
});
app.post('/campgrounds',function(req,res){
	var name=req.body.name;
	var image=req.body.image;
	var desc=req.body.description;
	var newCampground={name:name,image:image,description:desc};
	Campground.create(newCampground,function(err,camp){
		if(err) console.log(err);
		else {
			res.redirect("/campgrounds");
		}
	});
});
app.get('/campgrounds/new',function(req,res){
	res.render("campgrounds/new");
});

app.get("/campgrounds/:id",function(req,res){

	
	Campground.findById(req.params.id).populate("comments").exec(function(err,foundCamp){
		if(err){
			console.log(err);
		}
		else{
			console.log(foundCamp);
			res.render("campgrounds/show",{campground:foundCamp});
		}
	})
			
});

app.get("/campgrounds/:id/comments/new",function(req,res){
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
		}
		else{
			res.render("comments/new",{campground:campground});
		}
	})
});

app.post('/campgrounds/:id/comments',function(req,res){
	
	Campground.findById(req.params.id,function(err,campground){
		if(err){
			console.log(err);
			res.redirect('/campgrounds');
		}
		else{
			Comment.create(req.body.comment,function(err,comment){
				if(err){
					console.log(err);
				}
				else{
					campground.comments.push(comment);
					campground.save();
					res.redirect('/campgrounds/'+campground._id);
				}
			})

		}
	})
});


app.listen(8000,function(){
	console.log("server started");
});