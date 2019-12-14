var express = require('express');
var router = express.Router();
var Campground=require('../models/campground');
var Comment = require("../models/comment");
var geocoder = require('geocoder');
var middleware = require('../middleware/');
var { isLoggedIn, checkUserCampground, isSafe } = middleware; // destructuring assignment

// Define escapeRegex function for search feature
function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

//INDEX ROUTE - Show all Campgrounds
router.get('/', function (req, res) {
    if(req.query.search && req.xhr) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    //fetch data from DB
    Campground.find({}, function (err, allCampground) {
        if (err) {
            console.log(err);
        }else{
            res.status(200).json(allCampground);
        }
    });
    } else {
    //fetch data from DB
        Campground.find({}, function (err, allCampground) {
            if (err) {
                console.log(err);
            }else {
                if(req.xhr){
                    res.json(allCampground)
                } else {
                    res.render("campgrounds/index", {campgrounds: allCampground, page: 'campgrounds'});
                }
            }
        });
    }
});

//CREATE - send new camp to db
router.post('/', isSafe, isLoggedIn, function (req, res) {
    //get data from form and add to campground array
    var name = req.body.name;  //get data name (name) from form
    var image = req.body.image;  //get image (name) data from form
    var desc = req.body.description;
    var author = {
        id: req.user._id,//follows the structure of the schema - campground
        username: req.user.username
    };
    var cost = req.body.cost;
    geocoder.geocode(req.body.location, function (err, data) {
        if (err || data.status === 'ZERO_RESULTS') {
            req.flash('error', 'Invalid address');
            return res.redirect('back');
        }
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newCampground = { name: name, image: image, description: desc, cost: cost, author:author, location: location, lat: lat, lng: lng };
        // create new campgrounds to db
        Campground.create(newCampground, function (err, newlyCampground) {
            if (err) {
                console.log(err);
            } else {
                //redirect back to campground
                res.redirect('/campgrounds');
            }
        });
    });
});

//NEW - show form to create a new camp
router.get('/new', isLoggedIn, function (req, res) {
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
router.get('/:id/edit', isLoggedIn, checkUserCampground, function(req, res){
    Campground.findById(req.params.id, function (err, foundCampground) {
        res.render('campgrounds/edit', { campground: foundCampground });
    });
});

//Update Campground Route
router.put('/:id', isSafe, function(req,res){
    //find and update the correct campground
    geocoder.geocode(req.body.location, function (err, data) {
        var lat = data.results[0].geometry.location.lat;
        var lng = data.results[0].geometry.location.lng;
        var location = data.results[0].formatted_address;
        var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
        Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, updatedCampground){
            if(err){
                req.flash('error', err.message)
                res.redirect('/campgrounds');
            } else {
                //redirect to the show page
                req.flash('success', `Successfully updated ${newData.name}`)
                res.redirect('/campgrounds/'+req.params.id); //or + updatedCampground._id
            }
        });
    });    
});

//Destroy Campground - Route
router.delete('/:id', isLoggedIn, checkUserCampground, function(req,res){
    Comment.remove({
        _id: {
          $in: req.campground.comments
        }
      }, function(err) {
        if(err) {
            req.flash('error', err.message);
            res.redirect('/');
        } else {
            req.campground.remove(function(err) {
              if(err) {
                  req.flash('error', err.message);
                  return res.redirect('/');
              }
              req.flash('error', 'Campground deleted!');
              res.redirect('/campgrounds');
            });
        }
      })
});

module.exports = router;
