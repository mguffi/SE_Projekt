const express = require('express');
const bcrypt = require('bcrypt');
const pool = require('../db'); // Datenbankverbindung importieren
const router = express.Router();

// Datenbankverbindung testen
pool.query('SELECT 1')
    .then(() => console.log('Datenbankverbindung erfolgreich!'))
    .catch(err => console.error('Datenbankverbindung fehlgeschlagen:', err));

// Login-Route
router.get('/login', (req, res) => {
    // Login-Formular anzeigen
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await pool.execute('SELECT * FROM user WHERE name = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                req.session.user = { id: user.id, name: user.name, gender: user.gender };
                return res.redirect('/people');
            }
        }
        res.render('login', { error: 'Falscher Benutzername oder Passwort' });
    } catch (err) {
        console.error(err);
        res.render('login', { error: 'Interner Fehler' });
    }
});

// Signup-Route
router.get('/signup', (req, res) => {
    // Registrierungsformular anzeigen
    res.render('signup', { error: null });
});

router.post('/signup', async (req, res) => {
    const { username, password, gender } = req.body;
    try {
        const [existingUser] = await pool.execute('SELECT * FROM user WHERE name = ?', [username]);
        if (existingUser.length > 0) {
            return res.render('signup', { error: 'Benutzername ist bereits vergeben' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.execute('INSERT INTO user (name, password_hash, gender) VALUES (?, ?, ?)', [username, hashedPassword, gender]);

        res.redirect('/login');
    } catch (err) {
        console.error('Fehler beim Registrieren:', err);
        res.render('signup', { error: 'Interner Fehler. Bitte versuche es später erneut.' });
    }
});

// Logout-Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
            return res.render('error', { error: 'Logout fehlgeschlagen' });
        }
        res.redirect('/login'); // Weiterleitung zur Login-Seite
    });
});

module.exports = router;