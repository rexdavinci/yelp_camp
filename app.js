var express			= require ('express'),
	app				= express(),
	bodyParser		= require('body-parser'),
	mongoose		= require('mongoose'),
	flash			= require('connect-flash'),
	passport		= require('passport'),
	LocalStrategy	= require('passport-local'),
	methodOverride	= require('method-override'),
	Campground		= require('./models/campground'),
	Comment			= require('./models/comment'),
	User 			= require('./models/user'),
	seedDB			= require('./seeds');

//requiring routes
var commentRoutes		= require('./routes/comments'),
	campgroundRoutes	= require('./routes/campgrounds'),
	indexRoutes			= require('./routes/index');

mongoose.connect(process.env.DATABASE, { useNewUrlParser: true });

mongoose.set('useFindAndModify', false);
app.use(bodyParser.urlencoded({extended: true})); 
app.set('view engine', 'ejs');
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB(); //seed the database

//PASSPORT CONFIGURATION
app.use(require('express-session')({
	secret: "The Federal Government Loves You",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.error = req.flash('error');
	res.locals.success = req.flash('success');
	next();
});

app.use('/', indexRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/comments/', commentRoutes);

var port = process.env.PORT || 3000;

app.listen(port, function(){
	console.log(`Yelpcamp started on ${port}`);
});


// app.listen(3000, function () {
// 	console.log('YelpCamp Server Started On Port 3000');
// });