const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await req.db.execute('SELECT * FROM user WHERE name = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
                req.session.userId = user.id;
                return res.redirect('/profile');
            }
        }
        res.render('login', { error: 'Falscher Benutzername oder Passwort' });
    } catch (err) {
        console.error('Fehler beim Login:', err);
        res.render('login', { error: 'Ein Fehler ist aufgetreten' });
    }
});

router.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

router.post('/signup', async (req, res) => {
    const { username, password, gender, birthday } = req.body;
    try {
        const [existingUser] = await req.db.execute('SELECT * FROM user WHERE name = ?', [username]);
        if (existingUser.length > 0) {
            return res.render('signup', { error: 'Benutzername ist bereits vergeben' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await req.db.execute('INSERT INTO user (name, password_hash, gender, birthday) VALUES (?, ?, ?, ?)', 
                             [username, hashedPassword, gender, birthday]);

        res.redirect('/login');
    } catch (err) {
        console.error('Fehler beim Registrieren:', err);
        res.render('signup', { error: 'Ein Fehler ist aufgetreten' });
    }
});

router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;