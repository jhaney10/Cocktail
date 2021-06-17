const express = require('express');
const dotenv = require('dotenv');
//For Logger Middleware for Logging HTTP requests and errors
const morgan = require('morgan');
const exphbs = require('express-handlebars');


const connectDB = require('./config/db');


//Load  config file
dotenv.config({ path: './config/config.env'});

connectDB();

//Initialize app
const app = express();

if(process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

//Handlebars 
//setting the allowed extension name
app.engine('.hbs', exphbs({defaultLayout: 'main',extname: '.hbs'}));
app.set('view engine', '.hbs');

//Routes
app.use('/', require('./routes/index'))

//Port will be saved in the config file
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});