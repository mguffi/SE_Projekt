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
        const userId = req.session.user.id;
        const userGender = req.session.user.gender;

        // Filter aus der Session übernehmen oder Standardwerte setzen
        const filters = req.session.filters || {
            gender: req.session.user.gender === 'male' ? 'female' : 'male', // Standard: anderes Geschlecht
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

        // Datenbankabfrage: Nur eine zufällige Person anzeigen, die nicht geliked oder gedisliked wurde
        const [rows] = await pool.execute(
            `SELECT id, name, gender, birthday, image_url 
             FROM user 
             WHERE id != ? 
             AND gender = ? 
             AND birthday BETWEEN ? AND ? 
             AND id NOT IN (
                 SELECT liked_user_id FROM likes WHERE user_id = ?
                 UNION
                 SELECT disliked_user_id FROM dislikes WHERE user_id = ?
             )
             ORDER BY RAND() 
             LIMIT 1`,
            [userId, filters.gender, minBirthday, maxBirthday, userId, userId]
        );

        console.log('Gefundene Profile:', rows);

        if (rows.length > 0) {
            const profile = rows[0];

            // Alter berechnen
            const birthDate = new Date(profile.birthday);
            const today = new Date();
            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();
            const dayDiff = today.getDate() - birthDate.getDate();

            // Überprüfen, ob der Geburtstag in diesem Jahr noch nicht war
            if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
                age -= 1;
            }

            profile.age = age; // Alter wird hier gesetzt

            res.render('people', { profile, filters, error: null });
        } else {
            res.render('people', { profile: null, filters, error: 'Keine passenden Profile gefunden.' });
        }
    } catch (err) {
        console.error('Fehler beim Abrufen der Profile:', err);
        res.render('error', { message: 'Interner Fehler beim Abrufen der Profile', error: err });
    }
});

// Like-Route
router.post('/like', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const userId = req.session.user.id;
        const likedUserId = req.body.userId;

        console.log('Like von Benutzer:', userId, 'für Benutzer:', likedUserId);

        // Füge den Like in die Datenbank ein
        await pool.execute(
            `INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?)`,
            [userId, likedUserId]
        );

        res.redirect('/people');
    } catch (err) {
        console.error('Fehler beim Liken:', err);
        res.render('error', { message: 'Interner Fehler beim Liken', error: err });
    }
});

// Dislike-Route
router.post('/dislike', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const userId = req.session.user.id;
        const dislikedUserId = req.body.userId;

        console.log('Dislike von Benutzer:', userId, 'für Benutzer:', dislikedUserId);

        // Füge den Dislike in die Datenbank ein
        await pool.execute(
            `INSERT INTO dislikes (user_id, disliked_user_id) VALUES (?, ?)`,
            [userId, dislikedUserId]
        );

        res.redirect('/people');
    } catch (err) {
        console.error('Fehler beim Disliken:', err);
        res.render('error', { message: 'Interner Fehler beim Disliken', error: err });
    }
});

// Reset-Route für Dislikes
router.post('/reset', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const userId = req.session.user.id;

        console.log('Reset der Dislikes für Benutzer:', userId);

        // Lösche alle Dislikes des Benutzers
        await pool.execute(
            `DELETE FROM dislikes WHERE user_id = ?`,
            [userId]
        );

        res.redirect('/people');
    } catch (err) {
        console.error('Fehler beim Zurücksetzen der Dislikes:', err);
        res.render('error', { message: 'Interner Fehler beim Zurücksetzen der Dislikes', error: err });
    }
});

module.exports = router;