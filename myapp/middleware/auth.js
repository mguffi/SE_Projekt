const jwt = require('jsonwebtoken');
const JWT_SECRET = 'deinGeheimerJWTSchlüssel'; // Ersetze dies durch deinen sicheren Schlüssel

function authenticateToken(req, res, next) {
    // Lese Token aus Cookies
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ error: 'Kein Token bereitgestellt' });
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: 'Ungültiger Token' });
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;