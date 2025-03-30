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
        console.error(err);
        res.render('error', { error: 'Interner Fehler' });
    }
});

// Profilfelder aktualisieren (optional)
router.post('/update', async (req, res) => {
    const { image_url, name, gender, birthday } = req.body; // Felder aus dem Formular
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // Dynamische SQL-Abfrage basierend auf den übergebenen Feldern
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

        // Nur aktualisieren, wenn mindestens ein Feld übergeben wurde
        if (updates.length > 0) {
            const query = `UPDATE user SET ${updates.join(', ')} WHERE id = ?`;
            values.push(req.session.user.id);
            await pool.execute(query, values);
        }

        res.redirect('/profil');
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Interner Fehler beim Aktualisieren des Profils' });
    }
});

module.exports = router;
