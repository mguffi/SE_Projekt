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
<<<<<<< HEAD
        res.status(500).send('Ein Fehler ist aufgetreten');
=======
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

// Match-Route
router.get('/matches', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const userId = req.session.user.id;

        // Finde Matches: Benutzer, die sich gegenseitig geliked haben
        const [matches] = await pool.execute(
            `SELECT u.id, u.name, u.gender, u.image_url 
             FROM user u
             INNER JOIN likes l1 ON u.id = l1.liked_user_id
             INNER JOIN likes l2 ON l1.user_id = l2.liked_user_id
             WHERE l1.user_id = ? AND l2.user_id = ?`,
            [userId, userId]
        );

        console.log('Gefundene Matches:', matches);

        res.render('likes', { matches });
    } catch (err) {
        console.error('Fehler beim Abrufen der Matches:', err);
        res.render('error', { message: 'Interner Fehler beim Abrufen der Matches', error: err });
>>>>>>> 871aa86 (add chat route and update user redirection in authentication; include gender in user signup)
    }
});

module.exports = router;