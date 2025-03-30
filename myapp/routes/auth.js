const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const JWT_SECRET = 'your_jwt_secret';

// Login-Seite anzeigen
router.get('/login', (req, res) => {
    res.render('login', { error: null });
});

// Login-Route
router.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const [rows] = await req.db.execute('SELECT * FROM user WHERE name = ?', [username]);
        if (rows.length > 0) {
            const user = rows[0];
            const match = await bcrypt.compare(password, user.password_hash);
            if (match) {
<<<<<<< HEAD
                const token = jwt.sign(
                    { id: user.id, name: user.name, gender: user.gender },
                    JWT_SECRET,
                    { expiresIn: '1h' }
                );
                return res.json({ token });
=======
                req.session.user = { id: user.id, name: user.name, gender: user.gender };
                return res.redirect('/people');
>>>>>>> 871aa86 (add chat route and update user redirection in authentication; include gender in user signup)
            }
        }
        res.status(401).json({ error: 'Invalid username or password' });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Registrierung-Seite anzeigen
router.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});

// Registrierung-Route
router.post('/signup', async (req, res) => {
<<<<<<< HEAD
    const { username, password, gender, birthday } = req.body;
=======
    const { username, password, gender } = req.body;
>>>>>>> 871aa86 (add chat route and update user redirection in authentication; include gender in user signup)
    try {
        const [existingUser] = await req.db.execute('SELECT * FROM user WHERE name = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username already taken' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await req.db.execute(
            'INSERT INTO user (name, password_hash, gender, birthday, image_url) VALUES (?, ?, ?, ?, ?)',
            [
                username,
                hashedPassword,
                gender,
                birthday,
                `https://xsgames.co/randomusers/assets/avatars/${gender}/${Math.floor(Math.random() * 30) + 1}.jpg`,
            ]
        );

<<<<<<< HEAD
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ error: 'Internal server error' });
=======
        await pool.execute('INSERT INTO user (name, password_hash, gender) VALUES (?, ?, ?)', [username, hashedPassword, gender]);

        res.redirect('/login');
    } catch (err) {
        console.error('Fehler beim Registrieren:', err);
        res.render('signup', { error: 'Interner Fehler. Bitte versuche es später erneut.' });
>>>>>>> 871aa86 (add chat route and update user redirection in authentication; include gender in user signup)
    }
});

// Logout-Route
router.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error(err);
        }
        res.redirect('/login');
    });
});

module.exports = router;