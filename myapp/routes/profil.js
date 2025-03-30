// routes/profil.js
const express = require('express');
const pool = require('../db');
const router = express.Router();

// Profilseite anzeigen
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const [rows] = await pool.execute('SELECT * FROM user WHERE id = ?', [req.session.user.id]);
        if (rows.length > 0) {
            const user = rows[0];
            res.render('profil', { user });
        } else {
            res.redirect('/login');
        }
    } catch (err) {
        console.error('Fehler beim Laden des Profils:', err);
        res.render('error', { message: 'Fehler beim Laden des Profils', error: err });
    }
});

// Profilfelder aktualisieren
router.post('/update', async (req, res) => {
    console.log('Formulardaten:', req.body); // Debugging-Log
    const { image_url, name, gender, birthday } = req.body;

    if (!req.session.user) {
        console.log('Benutzer nicht eingeloggt'); // Debugging-Log
        return res.redirect('/login');
    }

    try {
        const updates = [];
        const values = [];

        if (image_url) {
            updates.push('image_url = ?');
            values.push(image_url);
        }
        if (name) {
            updates.push('name = ?');
            values.push(name);
        }
        if (gender) {
            updates.push('gender = ?');
            values.push(gender);
        }
        if (birthday) {
            updates.push('birthday = ?');
            values.push(birthday);
        }

        if (updates.length > 0) {
            const query = `UPDATE user SET ${updates.join(', ')} WHERE id = ?`;
            values.push(req.session.user.id);
            console.log('SQL-Query:', query); // Debugging-Log
            console.log('Werte:', values); // Debugging-Log
            await pool.execute(query, values);
        }

        res.redirect('/profil');
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Profils:', err);
        res.render('error', { message: 'Fehler beim Aktualisieren des Profils', error: err });
    }
});

module.exports = router;
