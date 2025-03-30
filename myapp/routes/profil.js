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

// Einzelnes Profilfeld aktualisieren
router.post('/update', async (req, res) => {
    const { field, value } = req.body; // Das zu ändernde Feld und der neue Wert
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Sicherheitsprüfung: Nur erlaubte Felder können aktualisiert werden
    const allowedFields = ['name', 'gender', 'birthday', 'image_url'];
    if (!allowedFields.includes(field)) {
        return res.status(400).render('error', { error: 'Ungültiges Feld' });
    }

    try {
        // Dynamische SQL-Abfrage für das spezifische Feld
        const query = `UPDATE user SET ${field} = ? WHERE id = ?`;
        await pool.execute(query, [value, req.session.user.id]);
        res.redirect('/profil');
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Interner Fehler beim Aktualisieren des Profils' });
    }
});

module.exports = router;
