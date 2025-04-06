const jwt = require('jsonwebtoken');
const JWT_SECRET = 'deinGeheimerJWTSchlüssel'; // Ersetze dies durch deinen sicheren Schlüssel

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Kein Token bereitgestellt' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            console.error('Token-Überprüfung fehlgeschlagen:', err); // Debugging-Log
            return res.status(403).json({ error: 'Ungültiger Token' });
        }
        req.user = user; // Benutzerinformationen aus dem Token speichern
        next();
    });
}

module.exports = authenticateToken;