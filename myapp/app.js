const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const peopleRouter = require('./routes/people');
const likesRouter = require('./routes/likes');
const chatRouter = require('./routes/chat');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Session-Middleware
app.use(session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: true,
}));

// Datenbankverbindung
const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'tinder_clone',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Middleware für Datenbankzugriff
app.use((req, res, next) => {
    req.db = pool;
    next();
});

// Authentifizierungs-Middleware
const authMiddleware = (req, res, next) => {
    if (req.session.userId) {
        next();
    } else {
        res.redirect('/login');
    }
};

// Routen
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/profile', authMiddleware, profileRouter);
app.use('/people', authMiddleware, peopleRouter);
app.use('/likes', authMiddleware, likesRouter);
app.use('/chat', authMiddleware, chatRouter);

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