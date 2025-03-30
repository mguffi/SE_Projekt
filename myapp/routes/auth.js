const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Beispiel: Datenbankverbindung importieren
const router = express.Router();

// Login-Route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const [rows] = await pool.execute('SELECT * FROM user WHERE name = ?', [username]);
    if (rows.length > 0) {
      const user = rows[0];
      // Passwort überprüfen (bcrypt vergleicht den eingegebenen Wert mit dem gespeicherten Hash)
      const match = await bcrypt.compare(password, user.password_hash);
      if (match) {
        // Benutzer in der Session speichern
        req.session.user = user;
        // Erfolgreicher Login: Weiterleitung zur Profilseite
        return res.redirect('/profil');
      }
    }
    // Falls Login fehlschlägt, wird eine Fehlermeldung angezeigt
    res.render('login', { error: 'Falscher Benutzername oder Passwort' });
  } catch (err) {
    console.error(err);
    res.render('login', { error: 'Interner Fehler' });
  }
});

// Signup-Route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.execute('INSERT INTO user (name, password_hash) VALUES (?, ?)', [username, hashedPassword]);
    res.redirect('/login');
  } catch (err) {
    console.error(err);
    res.render('signup', { error: 'Interner Fehler' });
  }
});

// Logout-Route
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.render('error', { error: 'Logout fehlgeschlagen' });
    }
    res.redirect('/login');
  });
});

module.exports = router;