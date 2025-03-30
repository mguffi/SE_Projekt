const express = require('express');
const router = express.Router();
const pool = require('../db'); // Datenbankverbindung importieren

// Likes-Seite anzeigen
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Weiterleitung zur Login-Seite, falls nicht eingeloggt
    }

    try {
        // Matches aus der Datenbank abrufen
        const [matches] = await pool.execute(
            `SELECT u.id, u.name, u.image_url 
             FROM user u 
             INNER JOIN matches m ON u.id = m.liked_user_id 
             WHERE m.user_id = ? AND m.liked_user_id IN (
                 SELECT user_id FROM matches WHERE liked_user_id = ?
             )`,
            [req.session.user.id, req.session.user.id]
        );

        res.render('likes', { matches });
    } catch (err) {
        console.error('Fehler beim Abrufen der Matches:', err);
        res.render('error', { error: 'Interner Fehler beim Abrufen der Matches' });
    }
});

module.exports = router;