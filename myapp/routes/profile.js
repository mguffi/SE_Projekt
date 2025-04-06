const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const [rows] = await req.db.execute('SELECT * FROM user WHERE id = ?', [req.session.userId]);
        if (rows.length > 0) {
            const user = rows[0];
            res.render('profile', { user });
        } else {
            res.status(404).send('Benutzer nicht gefunden');
        }
    } catch (err) {
        console.error('Fehler beim Abrufen des Profils:', err);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

router.post('/update', async (req, res) => {
    const { name, gender, birthday } = req.body;
    try {
        await req.db.execute('UPDATE user SET name = ?, gender = ?, birthday = ? WHERE id = ?', 
                             [name, gender, birthday, req.session.userId]);
        res.redirect('/profile');
    } catch (err) {
        console.error('Fehler beim Aktualisieren des Profils:', err);
        res.status(500).send('Ein Fehler ist aufgetreten');
    }
});

module.exports = router;