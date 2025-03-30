const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const { userId } = req.query;

    res.render('chat', { userId });
});

module.exports = router;