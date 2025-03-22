var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Neue Zeile: express-session einbinden
var session = require('express-session');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Wir fügen einen neuen Router für Authentifizierung hinzu:
var authRouter = require('./routes/auth');

var app = express();

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
  secret: 'dein geheimer Schlüssel', // bitte durch einen sicheren Wert ersetzen
  resave: false,
  saveUninitialized: true,
}));

// Routen registrieren
app.use('/', indexRouter);
// Falls du User-spezifische Funktionen hast:
app.use('/users', usersRouter);
// Unser neuer Authentifizierungs-Router (für Login, Signup, Logout)
app.use('/', authRouter);

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
