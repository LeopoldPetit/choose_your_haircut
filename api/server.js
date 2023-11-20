const express = require('express');
const sqlite3 = require('sqlite3');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '..', 'public')));

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

app.get('/login.html', (req, res) => {
    fs.readFile(path.join(__dirname, '..', 'public', 'login.html'), 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).send('Erreur lors de la lecture de la page de connexion');
        } else {
            res.send(data);
        }
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'main.html'));
    console.log(isLoggedIn);
});

const usersFilePath = path.resolve(__dirname, 'data/user.json');
let isLoggedIn = false;

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    fs.readFile(usersFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: 'Erreur de lecture du fichier des utilisateurs' });
            return;
        }

        try {
            const users = JSON.parse(data).users;

            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                isLoggedIn = true;
                res.status(200).json({ message: 'Connexion réussie' });
            } else {
                res.status(401).json({ error: 'Nom d\'utilisateur ou mot de passe incorrect' });
            }
        } catch (parseError) {
            console.error(parseError);
            res.status(500).json({ error: 'Erreur de parsing du fichier des utilisateurs' });
        }
    });
});

app.get('/api/isLoggedIn', (req, res) => {
    res.json({ isLoggedIn });
});

app.get('/api/logout', (req, res) => {
    isLoggedIn = false;
    console.log('L\'utilisateur a été déconnecté.');
    console.log(isLoggedIn);
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/`);
});
