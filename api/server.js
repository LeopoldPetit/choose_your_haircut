const cors = require('cors');

const express = require('express');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static('public'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
});