import sqlite3

# Fonction pour créer la table dans la base de données
def creer_table(cursor):
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS coiffeurs (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nom TEXT,
            latitude REAL,
            longitude REAL,
            numero TEXT,
            voie TEXT,
            ville TEXT,
            code_postal TEXT,
            marker_html TEXT,
            li_html TEXT,
            adresse TEXT
        )
    ''')

# Fonction pour insérer les données dans la base de données
def inserer_donnees(cursor, data):
    for feature in data['features']:
        properties = feature['properties']
        geometry = feature['geometry']['coordinates']

        cursor.execute('''
            INSERT INTO coiffeurs (nom, latitude, longitude, numero, voie, ville, code_postal, marker_html, li_html, adresse)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            properties['nom'],
            float(geometry[1]),
            float(geometry[0]),
            properties['num'],
            properties['voie'],
            properties['ville'],
            properties['codepostal'],
            properties['markerinnerhtml'],
            properties['liinnerhtml'],
            properties['addresse']
        ))



# Connexion à la base de données
connexion = sqlite3.connect('coiffeurs.db')
curseur = connexion.cursor()

# Créer la table
creer_table(curseur)

# Insérer les données
inserer_donnees(curseur,coiffeurs.json)

# Valider les modifications et fermer la connexion
connexion.commit()
connexion.close()
