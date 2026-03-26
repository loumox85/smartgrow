// On attend que le document soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {

    const burger = document.querySelector('.burger');
    const navUl = document.querySelector('.nav-container > ul');

    burger.addEventListener('click', () => {
      navUl.classList.toggle('show');
    });

    // Ferme le menu burger si on clique sur un lien
    navUl.addEventListener('click', (e) => {
        if (e.target.classList.contains('nav-link')) {
            navUl.classList.remove('show');
        }
    });

    const mainContent = document.querySelector('.main-content');
    let currentPagePath = ''; // Variable pour suivre la page actuelle

    // Fonction pour charger et afficher une nouvelle page
    async function loadPage(pagePath) {
        // Ajoute la classe pour commencer le fondu sortant
        mainContent.classList.add('fade-out');

        // Attend la fin de la transition avant de charger le nouveau contenu
        setTimeout(async () => {
            try {
                const response = await fetch(pagePath);
                if (!response.ok) {
                    throw new Error(`Erreur de chargement : ${response.status}`);
                }
                const content = await response.text();
                
                // Met à jour le contenu et retire la classe pour le fondu entrant
                mainContent.innerHTML = content;
                mainContent.classList.remove('fade-out');
                currentPagePath = pagePath; // Met à jour la page actuelle
            } catch (error) {
                console.error('Erreur lors du chargement de la page :', error);
                mainContent.innerHTML = `
                    <h1>Page non trouvée</h1>
                    <p>Désolé, cette page n\'existe pas.</p>
                    <p><strong>Chemin tenté :</strong> ${pagePath}</p>
                    <p><strong>Détails :</strong> ${error.message}</p>
                `;
                mainContent.classList.remove('fade-out'); // Assure que le contenu d'erreur est visible
            }
        }, 400); // Doit correspondre à la durée de la transition CSS
    }

    // Fonction pour définir le lien de navigation actif
    function setActiveNavLink(pagePath) {
        // On retire la classe 'active' de TOUS les liens
        document.querySelectorAll('.nav-link.active').forEach(activeLink => {
            activeLink.classList.remove('active');
        });

        // On ajoute la classe 'active' sur le lien correspondant au pagePath
        const targetLink = document.querySelector(`a[href="${pagePath}"]`);
        if (targetLink) {
            targetLink.classList.add('active');
        }
    }

    // On utilise la délégation d'événements pour gérer les clics sur les liens de navigation
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.nav-link, .team-member-button'); // Trouve le lien le plus proche
        if (link) {
            e.preventDefault();
            const pagePath = link.getAttribute('href');

            // Si la page demandée est déjà la page actuelle, ne rien faire
            if (pagePath === currentPagePath) {
                return;
            }

            loadPage(pagePath);
            setActiveNavLink(pagePath); // Mettre à jour la classe active
        }
    });

    // Gestion du chargement initial de la page
    function handleInitialLoad() {
        const repoName = 'smartgrow';

        // Retire slash de début/fin
        let path = window.location.pathname.replace(/^\/+|\/+$/g, '');

        if (path === repoName) {
            path = '';
        } else if (path.startsWith(repoName + '/')) {
            path = path.slice(repoName.length + 1);
        }

        if (path === '' || path === 'index.html') {
            path = 'Presentation_Projet/acceuil.html';
        }

        console.log('[DEBUG] handleInitialLoad resolve path ->', path);

        loadPage(path);
        setActiveNavLink(path);
    }

    handleInitialLoad();
});