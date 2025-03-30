const mysql = require('mysql2/promise');

// Datenbankverbindung konfigurieren
const pool = mysql.createPool({
    host: 'localhost', // Hostname des MySQL-Servers
    user: 'root',      // MySQL-Benutzername
    password: 'deinPasswort', // Passwort, das du in MySQL festgelegt hast
    database: 'name',  // Name der Datenbank, die du erstellt hast
});

module.exports = pool;