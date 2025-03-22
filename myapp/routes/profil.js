// routes/profil.js
const express = require('express');
const router = express.Router();

// Middleware, um sicherzustellen, dass der Benutzer eingeloggt ist
function requireLogin(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    res.redirect('/login');
  }
}

router.get('/', requireLogin, (req, res) => {
  res.render('profil', { user: req.session.user });
});

module.exports = router;
