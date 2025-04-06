const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); // JWT importieren
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
                return res.json({ token });
            }
        }
        res.status(401).json({ error: 'Falscher Benutzername oder Passwort' });
    } catch (err) {
        console.error('Fehler beim Login:', err);
        res.status(500).json({ error: 'Interner Fehler' });
    }
});

// Login-Funktion
async function login(username, password) {
    console.log('Login-Daten:', { username, password }); // Debugging
    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ username, password }),
        });

        console.log('Antwortstatus:', response.status); // Debugging

        if (!response.ok) {
            const error = await response.json();
            console.error('Login fehlgeschlagen:', error.error);
            alert('Login fehlgeschlagen: ' + error.error);
            return;
        }

        const data = await response.json();
        console.log('Login erfolgreich:', data);

        // Token im Local Storage speichern
        localStorage.setItem('token', data.token);

        // Weiterleitung zur geschützten Seite
        window.location.href = '/protected';
    } catch (err) {
        console.error('Fehler beim Login:', err);
    }
}

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

        await pool.execute('INSERT INTO user (name, password_hash, gender) VALUES (?, ?, ?)', [username, hashedPassword, gender]);

        res.status(201).json({ message: 'Benutzer erfolgreich registriert' });
    } catch (err) {
        console.error('Fehler beim Registrieren:', err);
        res.status(500).json({ error: 'Interner Fehler. Bitte versuche es später erneut.' });
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

// Middleware zur Überprüfung des JWT
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ error: 'Kein Token bereitgestellt' });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Ungültiger Token' });
        req.user = user; // Benutzerinformationen aus dem Token speichern
        next();
    });
}

// Beispiel einer geschützten Route
router.get('/protected', authenticateToken, (req, res) => {
    res.json({ message: `Willkommen, ${req.user.name}!`, user: req.user });
});

module.exports = router;