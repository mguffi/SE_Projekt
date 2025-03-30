router.post('/update', (req, res) => {
    const { gender, minAge, maxAge } = req.body;
    req.session.filters = { gender, minAge, maxAge };
    res.redirect('/people');
});