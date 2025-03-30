const mysql = require('mysql2/promise');

const pool = mysql.createPool({
    host: '127.0.0.1', // Verwende die IP-Adresse statt 'localhost'
    user: 'root',
    password: 'deinPasswort', // Ersetze 'deinPasswort' durch das korrekte Passwort
    database: 'test', // Ersetze 'name' durch den Namen deiner Datenbank
});

module.exports = pool;