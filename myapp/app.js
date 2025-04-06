var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

// Initialize the app
var app = express();

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var profilRouter = require('./routes/profil');
const likesRouter = require('./routes/likes');
const peopleRouter = require('./routes/people');
const chatRouter = require('./routes/chat'); // Importiere die Chat-Route

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session-Middleware konfigurieren
app.use(session({
    secret: 'deinGeheimerSchlüssel', // Ersetze durch einen sicheren Wert
    resave: false,
    saveUninitialized: true,
}));

// Routen registrieren
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authRouter);
app.use('/profil', profilRouter);
app.use('/likes', likesRouter);
app.use('/chat', chatRouter);
app.use('/people', peopleRouter); // Entferne die Filter-Route

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// Error-Handler
app.use(function (err, req, res, next) {
    res.locals.message = err.message || 'Ein Fehler ist aufgetreten';
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    res.status(err.status || 500);
    res.render('error', { message: res.locals.message, error: res.locals.error });
});

module.exports = app;