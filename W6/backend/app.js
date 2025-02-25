var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const connectDB = require('./config/database');
const hbs = require('hbs');



var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productsRouter = require('./routes/products');
const { seedDatabase } = require('./controllers/productController');

require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;


// Connect to MongoDB
connectDB();

// Seed the database with sample data (for testing purposes)
seedDatabase();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// Register partials directory
hbs.registerPartials(path.join(__dirname, 'views/partials'));

// Register hbs helper
hbs.registerHelper('times', function(n, block) {
    let accum = '';
    for (let i = 0; i < n; i++) {
        accum += block.fn(i);
    }
    return accum;
});

hbs.registerHelper('floor', function (num) {
  return Math.floor(num);
});

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productsRouter);


//Listen to server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;