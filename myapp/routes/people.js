const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [currentUser] = await req.db.execute('SELECT * FROM user WHERE id = ?', [req.session.userId]);
        const user = currentUser[0];

        const [rows] = await req.db.execute(`
            SELECT * FROM user 
            WHERE id != ? 
            AND gender IN (SELECT preferred_gender FROM user_preferences WHERE user_id = ?)
            AND age BETWEEN (SELECT min_age FROM user_preferences WHERE user_id = ?) 
                        AND (SELECT max_age FROM user_preferences WHERE user_id = ?)
            ORDER BY RAND() 
            LIMIT 1
        `, [req.session.userId, req.session.userId, req.session.userId, req.session.userId]);

        if (rows.length > 0) {
            res.render('people', { profile: rows[0], currentUser: user });
        } else {
            res.render('people', { profile: null, currentUser: user });
        }
    } catch (err) {
        console.error('Fehler beim Abrufen eines Profils:', err);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

router.post('/like', async (req, res) => {
    const { likedUserId } = req.body;
    try {
        await req.db.execute('INSERT INTO likes (user_id, liked_user_id) VALUES (?, ?)', 
                             [req.session.userId, likedUserId]);
        res.redirect('/people');
    } catch (err) {
        console.error('Fehler beim Liken:', err);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

router.post('/dislike', async (req, res) => {
    const { dislikedUserId } = req.body;
    try {
        await req.db.execute('INSERT INTO dislikes (user_id, disliked_user_id) VALUES (?, ?)', 
                             [req.session.userId, dislikedUserId]);
        res.redirect('/people');
    } catch (err) {
        console.error('Fehler beim Disliken:', err);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

module.exports = router;