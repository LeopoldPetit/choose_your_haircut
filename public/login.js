function Back() {
    window.location.href = 'http://localhost:3000'
}
function validateLogin() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/api/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username, password: password })
    })
        .then(response => {
            if (response.ok) {
                document.getElementById('loginMessage').innerText = 'Connexion réussie!';
                window.location.href = 'http://localhost:3000';

            } else {
                document.getElementById('loginMessage').innerText = 'Nom d\'utilisateur ou mot de passe incorrect.';
            }
        })
        .catch(error => {
            console.error('Erreur lors de la requête:', error);
            document.getElementById('loginMessage').innerText = 'Erreur lors de la connexion.';
        });
}
