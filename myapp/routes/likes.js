router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM user WHERE id IN (SELECT liked_user_id FROM likes WHERE user_id = ? AND liked_user_id IN (SELECT user_id FROM likes WHERE liked_user_id = ?))',
            [req.session.user.id, req.session.user.id]
        );
        res.render('likes', { matches: rows });
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Interner Fehler' });
    }
});