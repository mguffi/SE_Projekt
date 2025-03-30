const express = require('express');
const router = express.Router();

// Route zum Setzen der Filter
router.post('/set', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    // Filter aus dem Formular übernehmen
    const { gender, minAge, maxAge } = req.body;

    // Filter in der Session speichern
    req.session.filters = {
        gender: gender || (req.session.user.gender === 'male' ? 'female' : 'male'), // Standard: anderes Geschlecht
        minAge: parseInt(minAge, 10) || 18, // Standard: 18 Jahre
        maxAge: parseInt(maxAge, 10) || 99, // Standard: 99 Jahre
    };

    console.log('Neue Filter gesetzt:', req.session.filters);

    // Zurück zur People-Seite
    res.redirect('/people');
});

module.exports = router;