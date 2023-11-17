const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');

const app = express();
const port = 3000;

// Définir le dossier des fichiers statiques
app.use(express.static('public'));

// Chemin vers la base de données SQLite
const dbPath = path.resolve(__dirname, 'data/coiffeurs.db');

app.get('/api/coiffeurs/:page', (req, res) => {
    const page = req.params.page || 1;
    const limit = 10;
    const offset = (page - 1) * limit;

    let db = new sqlite3.Database(dbPath, sqlite3.OPEN_READWRITE, (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).json({ error: 'Erreur de connexion à la base de données' });
        } else {
            console.log('Connected to the SQLite database.');
        }
    });

    db.all(
        'SELECT nom, numero, voie, code_postal, ville FROM coiffeurs LIMIT ? OFFSET ?',
        [limit, offset],
        (err, rows) => {
            if (err) {
                console.error(err.message);
                res.status(500).json({ error: 'Erreur de base de données' });
            } else {
                res.json({ coiffeurs: rows });
            }
        }
    );

    db.close((err) => {
        if (err) {
            console.error(err.message);
        } else {
            console.log('Disconnected from the SQLite database.');
        }
    });
});
// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
