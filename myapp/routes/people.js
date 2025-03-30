const express = require('express');
const pool = require('../db'); // Datenbankverbindung importieren
const router = express.Router();

router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        // Standardwerte für Filter, falls sie nicht gesetzt sind
        const filters = req.session.filters || {
            gender: 'male',
            minAge: 18,
            maxAge: 99,
        };

        // Berechnung der Geburtsjahre basierend auf Altersgrenzen
        const currentYear = new Date().getFullYear();
        const minBirthday = new Date(currentYear - filters.maxAge, 0, 1).toISOString().split('T')[0];
        const maxBirthday = new Date(currentYear - filters.minAge, 11, 31).toISOString().split('T')[0];

        // Datenbankabfrage
        const [rows] = await pool.execute(
            `SELECT * FROM user 
             WHERE id != ? 
             AND gender = ? 
             AND birthday BETWEEN ? AND ? 
             ORDER BY RAND() 
             LIMIT 1`,
            [req.session.user.id, filters.gender, minBirthday, maxBirthday]
        );

        if (rows.length > 0) {
            res.render('people', { profile: rows[0] });
        } else {
            res.render('people', { error: 'Keine passenden Profile gefunden.' });
        }
    } catch (err) {
        console.error('Fehler beim Abrufen der Profile:', err);
        res.render('error', { message: 'Interner Fehler beim Abrufen der Profile', error: err });
    }
});

module.exports = router;