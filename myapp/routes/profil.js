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

// Alle Profilfelder aktualisieren
router.post('/update', async (req, res) => {
    const { image_url, name, gender, birthday } = req.body; // Alle Felder aus dem Formular
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // SQL-Abfrage, um alle Felder gleichzeitig zu aktualisieren
        const query = `UPDATE user SET image_url = ?, name = ?, gender = ?, birthday = ? WHERE id = ?`;
        await pool.execute(query, [image_url, name, gender, birthday, req.session.user.id]);
        res.redirect('/profil');
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Interner Fehler beim Aktualisieren des Profils' });
    }
});

module.exports = router;
