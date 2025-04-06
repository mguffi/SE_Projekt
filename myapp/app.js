const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const createError = require('http-errors');

// Routen importieren
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const profilRouter = require('./routes/profil');
const likesRouter = require('./routes/likes');
const peopleRouter = require('./routes/people');
const chatRouter = require('./routes/chat');
const filterRouter = require('./routes/filter');

// App initialisieren
const app = express();

// View-Engine einrichten
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Middleware
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session-Middleware konfigurieren
app.use(
    session({
        secret: 'deinGeheimerSchlüssel', // Ersetze dies durch einen sicheren Schlüssel
        resave: false,
        saveUninitialized: true,
    })
);

// Routen registrieren
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profil', profilRouter);
app.use('/likes', likesRouter);
app.use('/people', peopleRouter);
app.use('/chat', chatRouter);
app.use('/filter', filterRouter);

// Fehlerbehandlung für 404
app.use((req, res, next) => {
    next(createError(404));
});

// Fehler-Handler
app.use((err, req, res, next) => {
    // Lokale Variablen nur in der Entwicklungsumgebung bereitstellen
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // Fehlerseite rendern
    res.status(err.status || 500);
    res.render('error', { message: res.locals.message, error: res.locals.error });
});

module.exports = app;