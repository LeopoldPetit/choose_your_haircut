const coiffeursList = document.getElementById('coiffeursList');
let coiffeurCounter = 1;


// Variable pour contrôler le chargement de nouveaux coiffeurs
let loading = false;

fetchCoiffeurs(1); // Charge les premiers coiffeurs

// Fonction pour récupérer les coiffeurs depuis l'API
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
window.addEventListener('scroll', () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollHeight - scrollTop === clientHeight && !loading) {
        loading = true;
        const currentPage = document.querySelectorAll('.hover-background').length / 5 + 1;
        fetchCoiffeurs(currentPage);
    }
});