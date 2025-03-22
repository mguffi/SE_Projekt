// routes/auth.js
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
// routes/auth.js
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
