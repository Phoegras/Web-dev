var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const exphbs = require('express-handlebars');
const session = require('express-session');
const passport = require('passport');
const passportConfig = require('./config/passport');
passportConfig(passport);
const flash = require('connect-flash');

const indexRouter = require('./index/index');
const usersRouter = require('./users/usersRoute');
const authRouter = require('./authentication/authRoute');
const productsRouter = require('./products/productsRoute');
const cartRouter = require('./cart/cartRoute');
const orderRouter = require('./orders/ordersRoute');

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
app.use(
    session({
        secret: 'your_secret_key',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: null,
        },
    }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.isAuthenticated();
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/products', productsRouter);
app.use('/', cartRouter);
app.use('/orders', orderRouter);

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
