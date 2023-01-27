const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
//For Logger Middleware for Logging HTTP requests and errors
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
const methodOverride = require('method-override'); 
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo'); //for storing session


//Allow file uploads
const multer = require('multer')
const upload = multer({ dest: 'uploads/'})

//Db connection
const connectDB = require('./config/db');


//Load  config file
dotenv.config({ path: './config/config.env'});

//Passport config for Authentication
require('./config/passport')(passport);

connectDB();

//Initialize app
const app = express();

//Request Body parser
app.use(express.urlencoded({ extended: true})) //to accept form data
app.use(express.json())

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Method override to allow put and delete methods from form
app.use(methodOverride(function(req, res){
    if(req.body && typeof req.body === 'object' && '_method' in req.body){

        let method = req.body._method
        delete req.body._method
        return method
    }
}))

//Handlebars helpers

const {formatDate, select} = require('./helpers/hbs')
//Handlebars 
//setting the allowed extension name
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
        select
    },
     defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');



//Session Middleware should be above passport middleware
app.use(session({
    secret: 'cocktail',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URI})
    //cookie: { secure: true } //requires https
  }))

//Add passport Middleware
app.use(passport.initialize());
app.use(passport.session());  //requires express-session
 
//Set global variable
app.use(function (req, res, next) {
    res.locals.user = req.user || null //access global user
    next()
})
//Static Folder for Public Assets
app.use(express.static(path.join(__dirname, 'public')));


//Routes
app.use('/', require('./routes/index'))
app.use('/auth', require('./routes/auth'))
app.use('/cocktails', require('./routes/cocktails'))

//Port will be saved in the config file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on('unhandledRejection', function(err) {
    console.log(err);
});