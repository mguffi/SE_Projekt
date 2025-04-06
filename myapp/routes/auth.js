const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Datenbankverbindung importieren
const router = express.Router();

const JWT_SECRET = 'deinGeheimerJWTSchlüssel'; // Ersetze dies durch einen sicheren Schlüssel

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
                const token = jwt.sign(
                    { id: user.id, name: user.name, gender: user.gender },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                // Setze das Token als HttpOnly Cookie
                res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
                return res.json({ message: 'Login erfolgreich' });
            }
        }
        res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Interner Fehler' });
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
            return res.status(400).json({ error: 'Benutzername ist bereits vergeben' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.execute('INSERT INTO user (name, password_hash, gender) VALUES (?, ?, ?)', [
            username,
            hashedPassword,
            gender,
        ]);

        res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    } catch (err) {
        console.error('Fehler beim Registrieren:', err);
        res.status(500).json({ error: 'Interner Fehler' });
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