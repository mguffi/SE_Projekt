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

// Profil aktualisieren
router.post('/update', async (req, res) => {
    const { name, gender, birthday } = req.body;
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        await pool.execute(
            'UPDATE user SET name = ?, gender = ?, birthday = ? WHERE id = ?',
            [name, gender, birthday, req.session.user.id]
        );
        res.redirect('/profil');
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Interner Fehler beim Aktualisieren des Profils' });
    }
});

module.exports = router;
