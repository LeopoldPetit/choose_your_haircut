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
                    switchLayout();
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
