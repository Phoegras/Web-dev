var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');

var indexRouter = require('./index/index');
var usersRouter = require('./users/usersRoute');
const authRouter = require('./authentication/authRoute');
const productsRouter = require('./products/productsRoute');
const { seedDatabase, deleteProducts } = require('./products/productsBusiness');

require('dotenv').config();

var app = express();
const PORT = process.env.PORT || 3000;

// Seed the database with sample data (for testing purposes)
// deleteProducts();
// seedDatabase();

// view engine setup
const hbs = exphbs.create({
    defaultLayout: 'layout',
    extname: '.hbs',
    layoutsDir: 'views/layouts',
    partialsDir: 'views/partials',
    helpers: require('./config/handlebars-helpers'),
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');

//Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);

//Listen to server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
