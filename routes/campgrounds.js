var express = require('express');
var router = express.Router();
var Campground=require('../models/campground');
var middleware = require('../middleware/');

//INDEX ROUTE - Show all Routes
router.get('/', function (req, res) {

    //fetch data from DB
    Campground.find({}, function (err, allcampground) {
        if (err) {
            console.log(err);
        }
        res.render("campgrounds/index", { campgrounds: allcampground });
    });
});

//CREATE - send new camp to db
router.post('/', middleware.isLoggedIn, function (req, res) {
    //get data from form and add to campground array
    var name = req.body.name;  //get data name (name) from form
    var image = req.body.image;  //get image (name) data from form
    var desc = req.body.description;
    var author = {
        id: req.user._id,//follows the structure of the schema - campground
        username: req.user.username
    };
    var newCampground = { name: name, image: image, description: desc, author: author };
    // create new campgrounds to db
    Campground.create(newCampground, function (err, newlyCampground) {
        if (err) {
            console.log(err);
        }
        //redirect back to campground
        res.redirect('/campgrounds');
    });
});

//NEW - show form to create a new camp
router.get('/new', middleware.isLoggedIn, function (req, res) {
    res.render('campgrounds/new');
});

//SHOW Route - gives info about one campground
router.get('/:id', function (req, res) {
    //find the campground with ID 
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err || !foundCampground) {
            req.flash('error', 'Campground not found');
            res.redirect('back');
        } else {
        //find campground with given id
        res.render('campgrounds/show', { campground: foundCampground });
        }
    });

});

//Edit Campground Route
router.get('/:id/edit', middleware.checkCampgroundOwnership, function(req, res){
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//Update Campground Route
router.put('/:id', middleware.checkCampgroundOwnership, function(req,res){
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
        if(err){
            res.redirect('/campgrounds');
        } else {
            //redirect to the show page
            res.redirect('/campgrounds/'+req.params.id); //or + updatedCampground._id
        }
    });
    
});

//Destroy Campground - Route
router.delete('/:id', middleware.checkCampgroundOwnership, function(req,res){
    Campground.findByIdAndDelete(req.params.id, function(err){
        if(err){
            req.flash('error', err);
            res.redirect('/campgrounds');
        }
        req.flash('success', "Campground Successfully Deleted");
        res.redirect('/campgrounds');
    });
    
});

module.exports = router;
