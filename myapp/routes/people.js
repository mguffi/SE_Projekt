router.get('/', async (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    try {
        const [rows] = await pool.execute(
            'SELECT * FROM user WHERE id != ? AND gender = ? AND birthday BETWEEN ? AND ? ORDER BY RAND() LIMIT 1',
            [req.session.user.id, req.session.filters.gender, req.session.filters.minAge, req.session.filters.maxAge]
        );
        if (rows.length > 0) {
            res.render('people', { profile: rows[0] });
        } else {
            res.render('people', { error: 'Keine passenden Profile gefunden.' });
        }
    } catch (err) {
        console.error(err);
        res.render('error', { error: 'Interner Fehler' });
    }
});