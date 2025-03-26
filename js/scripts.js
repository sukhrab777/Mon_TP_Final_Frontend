// scripts.js

// === Menu Hamburger ===
const menuToggle = document.querySelector('#menu-toggle[aria-label="Menu de navigation"]');
const nav = document.querySelector('#main-nav');

menuToggle.addEventListener('click', () => {
    const isHidden = nav.hasAttribute('hidden');
    if (isHidden) {
        nav.removeAttribute('hidden');
    } else {
        nav.setAttribute('hidden', '');
    }
});

// === Accordéon pour recette.html ===
const recipeButtons = document.querySelectorAll('.btn-voir-recette');

recipeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const contentId = button.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        const isHidden = content.hasAttribute('hidden');
        if (isHidden) {
            content.removeAttribute('hidden');
            button.setAttribute('aria-expanded', 'true');
            button.textContent = 'Masquer la recette';
        } else {
            content.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
            button.textContent = 'Voir la recette';
        }
    });
});

// === Accordéon pour a-propos.html (FAQ) ===
const faqButtons = document.querySelectorAll('.faq-question');

faqButtons.forEach(button => {
    button.addEventListener('click', () => {
        const contentId = button.getAttribute('aria-controls');
        const content = document.getElementById(contentId);

        const isHidden = content.hasAttribute('hidden');
        if (isHidden) {
            content.removeAttribute('hidden');
            button.setAttribute('aria-expanded', 'true');
        } else {
            content.setAttribute('hidden', '');
            button.setAttribute('aria-expanded', 'false');
        }
    });
});

// === Gestion des favoris avec localStorage ===

// Charger les favoris depuis localStorage (ou initialiser un tableau vide)
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

// Fonction pour afficher un message de confirmation
function showConfirmationMessage(message, isSuccess = true) {
    // Créer l'élément de message
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('confirmation-message');
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert'); // Pour l'accessibilité
    messageDiv.style.position = 'fixed';
    messageDiv.style.top = '20px';
    messageDiv.style.right = '20px';
    messageDiv.style.padding = '10px 20px';
    messageDiv.style.backgroundColor = isSuccess ? '#28a745' : '#dc3545';
    messageDiv.style.color = '#fff';
    messageDiv.style.borderRadius = '5px';
    messageDiv.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
    messageDiv.style.zIndex = '1000';
    messageDiv.style.opacity = '0';
    messageDiv.style.transition = 'opacity 0.3s ease-in-out';

    // Ajouter le message au body
    document.body.appendChild(messageDiv);

    // Afficher le message avec une animation
    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 10);

    // Masquer le message après 3 secondes
    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// Mettre à jour l'état initial des boutons favoris
document.querySelectorAll('.favorite-toggle').forEach(button => {
    const recipeCard = button.closest('.recipes-card');
    const recipeTitle = recipeCard.querySelector('h2').textContent;

    // Vérifier si la recette est dans les favoris
    const isFavorite = favorites.some(fav => fav.title === recipeTitle);
    if (isFavorite) {
        button.textContent = '♥'; // Icône remplie
        button.setAttribute('aria-label', 'Retirer des favoris');
    } else {
        button.textContent = '♡'; // Icône vide
        button.setAttribute('aria-label', 'Ajouter aux favoris');
    }

    // Ajouter l'écouteur d'événements pour ajouter/retirer des favoris
    button.addEventListener('click', () => {
        const recipeData = {
            title: recipeTitle,
            category: recipeCard.querySelector('.tag.category')?.textContent || 'Inconnu',
            time: recipeCard.querySelector('.tag.time')?.textContent || 'Inconnu',
            difficulty: recipeCard.querySelector('.tag.difficulty')?.textContent || 'Inconnu',
            image: recipeCard.querySelector('img')?.src || 'assets/images/placeholder.jpg'
        };

        const index = favorites.findIndex(fav => fav.title === recipeTitle);
        if (index === -1) {
            // Ajouter aux favoris
            favorites.push(recipeData);
            button.textContent = '♥';
            button.setAttribute('aria-label', 'Retirer des favoris');
            showConfirmationMessage('Recette ajoutée aux favoris !');
        } else {
            // Retirer des favoris
            favorites.splice(index, 1);
            button.textContent = '♡';
            button.setAttribute('aria-label', 'Ajouter aux favoris');
            showConfirmationMessage('Recette retirée des favoris !', false);
        }

        // Sauvegarder les favoris dans localStorage
        localStorage.setItem('favorites', JSON.stringify(favorites));

        // Mettre à jour la page favoris.html (si on est sur cette page)
        if (document.querySelector('.favorites-section')) {
            updateFavoritesSection();
        }
    });
});

// Fonction pour mettre à jour la section des favoris
function updateFavoritesSection() {
    const favoritesSection = document.querySelector('.favorites-section');
    const noFavoritesMessage = document.querySelector('#no-favorites-message');
    const recipesGrid = document.createElement('div');
    recipesGrid.classList.add('recipes-grid');

    if (favorites.length === 0) {
        noFavoritesMessage.style.display = 'block';
        if (favoritesSection.querySelector('.recipes-grid')) {
            favoritesSection.querySelector('.recipes-grid').remove();
        }
    } else {
        noFavoritesMessage.style.display = 'none';
        favorites.forEach(recipe => {
            const recipeCard = document.createElement('article');
            recipeCard.classList.add('recipes-card');

            // Créer une carte complète avec les données stockées
            recipeCard.innerHTML = `
                <div class="recipe-image-container">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <button class="favorite-toggle" aria-label="Retirer des favoris">♥</button>
                </div>
                <div class="recipe-details">
                    <h2>${recipe.title}</h2>
                    <div class="recipe-tags">
                        <span class="tag category">${recipe.category}</span>
                        <span class="tag time">${recipe.time}</span>
                        <span class="tag difficulty">${recipe.difficulty}</span>
                    </div>
                    <a href="recette.html" class="btn-voir-recette">Voir la recette</a>
                </div>
            `;

            recipesGrid.appendChild(recipeCard);
        });

        // Ajouter la grille à la section
        if (favoritesSection.querySelector('.recipes-grid')) {
            favoritesSection.querySelector('.recipes-grid').remove();
        }
        favoritesSection.appendChild(recipesGrid);

        // Ré-attacher les écouteurs d'événements pour les nouveaux boutons favoris
        recipesGrid.querySelectorAll('.favorite-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const recipeTitle = button.closest('.recipes-card').querySelector('h2').textContent;
                const index = favorites.findIndex(fav => fav.title === recipeTitle);
                if (index !== -1) {
                    favorites.splice(index, 1);
                    button.textContent = '♡';
                    button.setAttribute('aria-label', 'Ajouter aux favoris');
                    // Mettre à jour localStorage
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    showConfirmationMessage('Recette retirée des favoris !', false);
                    updateFavoritesSection();
                }
            });
        });
    }
}

// Appeler updateFavoritesSection au chargement de la page (si on est sur favoris.html)
if (document.querySelector('.favorites-section')) {
    updateFavoritesSection();
}