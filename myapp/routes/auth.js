// routes/auth.js
var express = require('express');
var router = express.Router();

// Simulierter Benutzerspeicher (in Produktion: Datenbank!)
let users = [];

/* GET Login-Seite */
router.get('/login', (req, res) => {
  res.render('login');
});

/* POST Login-Daten verarbeiten */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  let user = users.find(u => u.username === username && u.password === password);

  if (user) {
    req.session.user = user;
    res.redirect('/');
  } else {
    res.send('Falscher Benutzername oder Passwort.');
  }
});

/* GET Registrierungsseite */
router.get('/signup', (req, res) => {
  res.render('signup');
});

/* POST Registrierungsdaten verarbeiten */
router.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Überprüfen, ob der Benutzername schon existiert
  if (users.find(u => u.username === username)) {
    return res.send('Benutzername bereits vergeben. Bitte wähle einen anderen.');
  }
  
  // Neuen Benutzer erstellen (in der Realität: Passwort hashen!)
  let newUser = { id: users.length + 1, username, password };
  users.push(newUser);
  
  // Benutzer in der Session speichern
  req.session.user = newUser;
  res.redirect('/');
});

/* Logout: Session zerstören */
router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) return res.send('Fehler beim Logout.');
    res.redirect('/login');
  });
});

module.exports = router;
