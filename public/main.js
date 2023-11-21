const coiffeursList = document.getElementById('coiffeursList');
let coiffeurCounter = 1;
let isLoggedIn = false;
let loading = false;
checkLoginStatus();
fetchCoiffeurs(1);

function fetchCoiffeurs(page) {
    fetch(`http://localhost:3000/api/coiffeurs/${page}`)
        .then(response => response.json())
        .then(data => {
            data.coiffeurs.forEach(coiffeur => {
                const div = document.createElement('div');
                div.innerHTML = `
                        ${coiffeur.nom}<br>
                        ${coiffeur.numero}<br>
                        ${coiffeur.voie}<br>
                        ${coiffeur.code_postal}<br>
                        ${coiffeur.ville}
                        <span class="coiffeurNumber">${coiffeurCounter++}</span><br><br>
                    `;
                div.classList.add('hover-background');
                coiffeursList.appendChild(div);
                div.addEventListener('click', () => {
                    displayCoiffeurDetails(coiffeur);
                });


                // Gestion du changement de couleur au survol
                div.addEventListener('mouseenter', () => {
                    div.style.backgroundColor = '#e630da';
                });

                div.addEventListener('mouseleave', () => {
                    div.style.backgroundColor = '';
                });
            });
            loading = false; // Réinitialise le chargement
        })
        .catch(error => console.error('Erreur:', error));
}

// Gestion du scroll pour charger de nouveaux coiffeurs
const contentWrapper = document.getElementById('contentWrapper');

// Ajout de l'événement de défilement à contentWrapper
contentWrapper.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = contentWrapper;
    if (scrollHeight - scrollTop === clientHeight && !loading) {
        loading = true;
        const currentPage = document.querySelectorAll('.hover-background').length / 5 + 1;
        fetchCoiffeurs(currentPage);
    }
});
const otherContent = document.getElementById('otherContent');

otherContent.addEventListener('wheel', (event) => {
    event.preventDefault(); // Bloque le défilement
});

function displayCoiffeurDetails(coiffeur) {
    const mapContainer = document.createElement('div');
    mapContainer.id = 'map'; // Identifiant du conteneur de la carte
    mapContainer.style.margin = '0 20px';
    mapContainer.style.height = '400px'; // Hauteur de la carte (modifiable)
    const coiffeurDetailsContainer = document.getElementById('coiffeurDetailsContainer');
    coiffeurDetailsContainer.innerHTML = `
        <div class="coiffeur-details">
        <div class="detail-row">
            <strong class="detail-label">Nom:</strong>
            <span class="detail-value"><strong>${coiffeur.nom}</strong></span>
        </div>
        <div class="detail-row">
            <strong class="detail-label">Numéro:</strong>
            <span class="detail-value">${coiffeur.numero}</span>
        </div>
        <div class="detail-row">
            <strong class="detail-label">Voie:</strong>
            <span class="detail-value">${coiffeur.voie}</span>
        </div>
        <div class="detail-row">
            <strong class="detail-label">Code postal:</strong>
            <span class="detail-value">${coiffeur.code_postal}</span>
        </div>
        <div class="detail-row">
            <strong class="detail-label">Ville:</strong>
            <span class="detail-value">${coiffeur.ville}</span>
        </div>
    </div>
    
    
    `;

    // Afficher la nouvelle partie
    const secondColumn = document.getElementById('otherContent');
    secondColumn.innerHTML = ''; // Efface le contenu précédent s'il y en avait
    secondColumn.appendChild(coiffeurDetailsContainer);
    secondColumn.appendChild(mapContainer);
    const map = L.map('map').setView([coiffeur.latitude, coiffeur.longitude], 13);

    // Ajouter une couche de tuiles OpenStreetMap à la carte
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Ajouter un marqueur à l'emplacement du coiffeur
    L.marker([coiffeur.latitude, coiffeur.longitude]).addTo(map)
        .bindPopup(`<b>${coiffeur.nom}</b><br>${coiffeur.voie}, ${coiffeur.code_postal}, ${coiffeur.ville}`)
        .openPopup();
    switchLayout(); // Appel de la fonction pour basculer le layout



}

document.addEventListener('DOMContentLoaded', () => {
    const contentWrapper = document.getElementById('contentWrapper');
    const coiffeursList = document.getElementById('coiffeursList');
    const coiffeurDetailsContainer = document.createElement('div');
    coiffeurDetailsContainer.id = 'coiffeurDetailsContainer';
    document.body.appendChild(coiffeurDetailsContainer);

    coiffeursList.addEventListener('click', (event) => {
        const coiffeurElement = event.target.closest('.hover-background');
        if (coiffeurElement) {
            // Simuler le changement de largeur de la partie droite
            contentWrapper.classList.toggle('hide-right-section');
        }
    });
});



function switchLayout() {
    const firstColumn = document.getElementById('contentWrapper');
    const secondColumn = document.getElementById('otherContent');

    if (firstColumn.classList.contains('first-column')) {
        firstColumn.style.width = '50%';
        secondColumn.style.width = '50%';
    } else {
        firstColumn.style.width = '100%';
        secondColumn.style.width = '0';
    }
    firstColumn.style.transition = 'width 0.5s ease-in-out';
    secondColumn.style.transition = 'width 0.5s ease-in-out';
    firstColumn.classList.toggle('first-column');
    secondColumn.classList.toggle('second-column');
}


function openLoginPage() {
    window.location.href = 'http://localhost:3000/login.html';
}
function checkLoginStatus() {
    fetch('http://localhost:3000/api/isLoggedIn')
        .then(response => response.json())
        .then(data => {
             isLoggedIn = data.isLoggedIn;

            if (isLoggedIn) {
                const loginButton = document.getElementById('loginButton');
                loginButton.remove();
                appendLogoutButton();
            } else {
                console.log('L\'utilisateur n\'est pas connecté.');
            }
        })
        .catch(error => console.error('Erreur:', error));
}

function appendLogoutButton() {
    const navbar = document.querySelector('.navbar');

    const logoutButton = document.createElement('button');
    logoutButton.id = 'logoutButton';
    const logoutIcon = document.createElement('img');
    logoutIcon.src = 'img/logout.png';
    logoutIcon.alt = 'Logout';
    logoutButton.appendChild(logoutIcon);
    logoutButton.addEventListener('click', () => {
        fetch('http://localhost:3000/api/logout')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
            })
            .catch(error => {
                console.error('Error:', error);
            });
        window.location.reload()
    });
    navbar.appendChild(logoutButton);
}
