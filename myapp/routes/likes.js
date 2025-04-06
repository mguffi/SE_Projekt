const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.execute(`
            SELECT u.* FROM user u
            INNER JOIN likes l1 ON u.id = l1.liked_user_id
            INNER JOIN likes l2 ON u.id = l2.user_id
            WHERE l1.user_id = ? AND l2.liked_user_id = ?
        `, [req.session.userId, req.session.userId]);

        res.render('likes', { matches: rows });
    } catch (err) {
        console.error('Fehler beim Abrufen der Matches:', err);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

module.exports = router;