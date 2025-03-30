var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');

var indexRouter = require('./routes/index');
app.use('/', indexRouter);
var usersRouter = require('./routes/users');
// Neuer Router für Authentifizierung (Login, Signup, Logout)
var authRouter = require('./routes/auth');
// Router für die Profilseite
var profilRouter = require('./routes/profil');

app.use('/profil', profilRouter);
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Direkt den Profil-Router einbinden, falls der Aufruf schon hier erfolgen soll
app.use('/profil', profilRouter);

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
app.use('/users', usersRouter);
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
