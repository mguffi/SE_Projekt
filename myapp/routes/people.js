const express = require('express');
const pool = require('../db'); // Importiere die Datenbankverbindung
const router = express.Router(); // Initialisiere den Router

// Route für die People-Seite
router.get('/', async (req, res) => {
    if (!req.session.user) {
        console.error('Benutzer ist nicht eingeloggt.');
        return res.redirect('/login');
    }

    try {
        // Benutzerinformationen aus der Session
        const userId = req.session.user.id;
        const userGender = req.session.user.gender;

        console.log('Benutzer-ID:', userId);
        console.log('Benutzer-Geschlecht:', userGender);

        // Standardfilter: Zeige das andere Geschlecht an
        const filters = req.session.filters || {
            gender: userGender === 'male' ? 'female' : 'male', // Standardmäßig das andere Geschlecht
            minAge: 18,
            maxAge: 99,
        };

        console.log('Filter:', filters);

        // Berechnung der Geburtsjahre basierend auf Altersgrenzen
        const currentYear = new Date().getFullYear();
        const minBirthday = new Date(currentYear - filters.maxAge, 0, 1).toISOString().split('T')[0];
        const maxBirthday = new Date(currentYear - filters.minAge, 11, 31).toISOString().split('T')[0];

        console.log('MinBirthday:', minBirthday);
        console.log('MaxBirthday:', maxBirthday);

        // Datenbankabfrage: Nur eine zufällige Person anzeigen
        const [rows] = await pool.execute(
            `SELECT id, name, gender, birthday, image_url 
             FROM user 
             WHERE id != ? 
             AND gender = ? 
             AND birthday BETWEEN ? AND ? 
             ORDER BY RAND() 
             LIMIT 1`,
            [userId, filters.gender, minBirthday, maxBirthday]
        );

        console.log('Gefundene Profile:', rows);

        if (rows.length > 0) {
            res.render('people', { profile: rows[0], error: null }); // Fehler ist null, wenn ein Profil gefunden wurde
        } else {
            res.render('people', { profile: null, error: 'Keine passenden Profile gefunden.' });
        }
    } catch (err) {
        console.error('Fehler beim Abrufen der Profile:', err);
        res.render('error', { message: 'Interner Fehler beim Abrufen der Profile', error: err });
    }
});

module.exports = router; // Exportiere den Router