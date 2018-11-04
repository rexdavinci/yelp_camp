var mongoose = require('mongoose');
var Campground = require("./models/campground");
var Comment = require('./models/comment');

var data = [
    {
        name: "Cloud Rest",
        image: "https://pixabay.com/get/ea34b80720f2003ed1584d05fb1d4e97e07ee3d21cac104491f0c57ca2ecb2bc_340.jpg",
        description: "nisi porta lacinia semper, ante est gravida nunc, fermentum maximus massa quam ac ipsum. In aliquet dolor id leo rhoncus laoreet eget non tortor. Ut vulputate, nisl id tincidunt porttitor, quam lacus mattis erat, non iaculis augue neque et dolor. Nulla feugiat ipsum id elit vehicula convallis. Nullam mattis sit amet urna vel vestibulum. Morbi eleifend, dui et elementum pellentesque, lectus quam gravida dolor, in ullamcorper dui elit eget quam. Pellentesque rhoncus dui vitae eros mattis, id tempor velit varius. Nullam pulvinar odio in vulputate sodales. Ut sit amet nunc eu odio fermentum feugiat. Maecenas mollis magna a quam sollicitudin euismod. Etiam tincidunt dolor a orci tempus pellentesque. Suspendisse potenti. Vestibulum aliquet blandit justo, a facilisis elit feugiat non. Maecenas ac elit et ex pretium aliquet a eu eros."
    },
    {
        name: "River Blend",
        image: "https://pixabay.com/get/eb36b40a2cf51c22d2524518b7444795ea76e5d004b0144595f4c47ca6eab1_340.jpg",
        description: "ro tortor nec libero. Integer sit amet porta est. Duis varius laoreet tortor, vel posuere ex tristique quis. Aenean condimentum lobortis lorem. Duis egestas, libero vel laoreet tristique, neque lectus sollicitudin ex, a malesuada nibh lectus sed ex. Ut eu lacus tempus, rutrum turpis molestie, blandit urna. Aliquam urna ex, rhoncus et faucibus bibendum, eleifend non dolor. Pellentesque sagittis ex sed augue tempor vulputate. Donec nec interdum mi. Maecenas molestie, urna a egestas interdum, mauris ex lobortis lorem, nec scelerisque est turpis eget eros. "
    },
    {
        name: "Santa Fun",
        image: "https://pixabay.com/get/eb3cb20e20f0023ed1584d05fb1d4e97e07ee3d21cac104491f0c57ca2ecb2bc_340.png",
        description: "llus eu enim volutpat, hendrerit nisi quis, accumsan turpis. Maecenas sollicitudin, ligula tempor aliquam ultrices, tellus purus sagittis tellus, sed finibus tellus tellus et nisi. Nam hendrerit imperdiet dui ut vestibulum. Mauris vehicula purus ut tempus vestibulum. Nullam ut tortor leo. Aliquam accumsan hendrerit arcu nec"
    }


];


function seedDB(){
    //remove all campgrounds
    Campground.deleteMany({}, function (err) {
        if (err) {
            console.log(err);
        }
        console.log('DB is cleared');
        //add some campgrounds
        data.forEach(function (seed) {
            Campground.create(seed, function (err, campground) {
                if (err) {
                    console.log(err);
                }
                console.log('new campground added');
                //create comment
                Comment.create(
                    {
                        text: "This is awesome",
                        author: "Homer"
                    }, function(err, comment){
                        if(err){
                            console.log(err);
                        } else{
                            campground.comments.push(comment);
                            campground.save();
                            console.log('comment saved');
                        }
                    });
            });
        });
    });
    
    

}




module.exports = seedDB;
