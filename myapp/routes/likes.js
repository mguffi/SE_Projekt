const express = require('express');
const router = express.Router();
const pool = require('../db'); // Datenbankverbindung importieren

// Likes-Seite anzeigen
router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Weiterleitung zur Login-Seite, falls nicht eingeloggt
    }

    try {
        const userId = req.session.user.id;

        // Einseitige Likes abrufen
        const [likes] = await pool.execute(
            `SELECT u.id, u.name, u.image_url 
             FROM user u 
             INNER JOIN likes l ON u.id = l.liked_user_id 
             WHERE l.user_id = ? AND u.id NOT IN (
                 SELECT l2.user_id FROM likes l2 WHERE l2.liked_user_id = ?
             )`,
            [userId, userId]
        );

        // Gegenseitige Matches abrufen
        const [matches] = await pool.execute(
            `SELECT u.id, u.name, u.image_url 
             FROM user u 
             INNER JOIN likes l1 ON u.id = l1.liked_user_id 
             INNER JOIN likes l2 ON l1.user_id = l2.liked_user_id 
             WHERE l1.user_id = ? AND l2.user_id = ?`,
            [userId, userId]
        );

        res.render('likes', { likes, matches });
    } catch (err) {
        console.error('Fehler beim Abrufen der Likes und Matches:', err);
        res.render('error', { error: 'Interner Fehler beim Abrufen der Likes und Matches' });
    }
});

module.exports = router;