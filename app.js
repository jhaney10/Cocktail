const path = require('path');
const express = require('express');
const dotenv = require('dotenv');
//For Logger Middleware for Logging HTTP requests and errors
const morgan = require('morgan');
const mongoose = require('mongoose');
const exphbs = require('express-handlebars');
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


//Handlebars helpers

const {formatDate} = require('./helpers/hbs')
//Handlebars 
//setting the allowed extension name
app.engine('.hbs', exphbs({
    helpers: {
        formatDate,
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