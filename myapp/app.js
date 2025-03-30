const express = require('express');
const session = require('express-session');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mysql = require('mysql2/promise');
const jwt = require('jsonwebtoken');
const createError = require('http-errors');

const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const peopleRouter = require('./routes/people');
const likesRouter = require('./routes/likes');
const chatRouter = require('./routes/chat');

<<<<<<< HEAD
const app = express();
=======
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
// Neuer Router für Authentifizierung (Login, Signup, Logout)
var authRouter = require('./routes/auth');
// Router für die Profilseite
var profilRouter = require('./routes/profil');
const likesRouter = require('./routes/likes'); // Importiere die Likes-Route
const peopleRouter = require('./routes/people'); // Importiere die People-Route
const filterRouter = require('./routes/filter'); // Importiere die Filter-Route
const chatRouter = require('./routes/chat'); // Importiere die Chat-Route
>>>>>>> 871aa86 (add chat route and update user redirection in authentication; include gender in user signup)

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

// JWT-Authentifizierungs-Middleware
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Unauthorized' });
    }

    jwt.verify(token, 'your_jwt_secret', (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Forbidden' });
        }
        req.user = user;
        next();
    });
};

// Routen
app.use('/', indexRouter);
<<<<<<< HEAD
app.use('/auth', authRouter);
app.use('/profile', profileRouter);
app.use('/people', authenticateJWT, peopleRouter);
app.use('/likes', authenticateJWT, likesRouter);
app.use('/chat', authenticateJWT, chatRouter);
=======
app.use('/users', usersRouter);
app.use('/', authRouter);
app.use('/profil', profilRouter);
app.use('/likes', likesRouter); // Registriere die Likes-Route
app.use('/people', peopleRouter); // Registriere die People-Route
app.use('/filter', filterRouter); // Registriere die Filter-Route
app.use('/chat', chatRouter); // Registriere die Chat-Route
>>>>>>> 871aa86 (add chat route and update user redirection in authentication; include gender in user signup)

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