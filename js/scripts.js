// === Menu Hamburger ===
const navToggle = document.querySelector('#nav-toggle[aria-label="Menu de navigation"]');
const nav = document.querySelector('#main-nav');

navToggle.addEventListener('click', () => {
    const isHidden = nav.hasAttribute('hidden');
    if (isHidden) {
        nav.removeAttribute('hidden');
        navToggle.setAttribute('aria-expanded', 'true');
    } else {
        nav.setAttribute('hidden', '');
        navToggle.setAttribute('aria-expanded', 'false');
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
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];

document.querySelectorAll('.favorite-toggle').forEach(button => {
    // Cherche l'ancêtre le plus proche : soit .recipes-card, soit .recipe-details
    const recipeContainer = button.closest('.recipes-card') || button.closest('.recipe-details');
    
    // Vérifie que recipeContainer existe et contient un h2
    if (!recipeContainer || !recipeContainer.querySelector('h2')) {
        console.warn('Aucun conteneur de recette ou titre trouvé pour ce bouton favori.');
        return; // Ignore ce bouton pour éviter l'erreur
    }

    const recipeTitle = recipeContainer.querySelector('h2').textContent;

    const isFavorite = favorites.some(fav => fav.title === recipeTitle);
    if (isFavorite) {
        button.textContent = '♥';
        button.setAttribute('aria-label', 'Retirer des favoris');
        button.setAttribute('aria-pressed', 'true');
    } else {
        button.textContent = '♡';
        button.setAttribute('aria-label', 'Ajouter aux favoris');
        button.setAttribute('aria-pressed', 'false');
    }

    button.addEventListener('click', () => {
        const recipeData = {
            title: recipeContainer.querySelector('h2')?.textContent || '',
            category: recipeContainer.querySelector('.tag.category')?.textContent || 'Inconnu',
            time: recipeContainer.querySelector('.tag.time')?.textContent || 'Inconnu',
            difficulty: recipeContainer.querySelector('.tag.difficulty')?.textContent || 'Inconnu',
            image: recipeContainer.querySelector('img')?.src || 'assets/images/placeholder.jpg'
        };

        const index = favorites.findIndex(fav => fav.title === recipeData.title);
        if (index === -1) {
            favorites.push(recipeData);
            button.textContent = '♥';
            button.setAttribute('aria-label', 'Retirer des favoris');
            button.setAttribute('aria-pressed', 'true');
            showConfirmationMessage('Recette ajoutée aux favoris !');
        } else {
            favorites.splice(index, 1);
            button.textContent = '♡';
            button.setAttribute('aria-label', 'Ajouter aux favoris');
            button.setAttribute('aria-pressed', 'false');
            showConfirmationMessage('Recette retirée des favoris !');
        }

        localStorage.setItem('favorites', JSON.stringify(favorites));

        if (document.querySelector('.favorites-section')) {
            updateFavoritesSection();
        }
    });
});

function updateFavoritesSection() {
    const favoritesSection = document.querySelector('.favorites-section');
    const noFavoritesMessage = document.querySelector('#no-favorites-message');
    let recipesGrid = favoritesSection.querySelector('.recipes-grid');

    if (!recipesGrid) {
        recipesGrid = document.createElement('div');
        recipesGrid.classList.add('recipes-grid');
        favoritesSection.appendChild(recipesGrid);
    }

  if (favorites.length === 0) {
    if (noFavoritesMessage) {
        noFavoritesMessage.style.display = 'block';
    }
    recipesGrid.innerHTML = '';
} else {
    if (noFavoritesMessage) {
        noFavoritesMessage.style.display = 'none';
    }
    recipesGrid.innerHTML = '';

        favorites.forEach(recipe => {
            if (!recipe.title || !recipe.category || !recipe.time || !recipe.difficulty || !recipe.image) {
                return; // Ignore les recettes mal formées
            }

            const recipeCard = document.createElement('article');
            recipeCard.classList.add('recipes-card');

            recipeCard.innerHTML = `
                <div class="recipe-image-container">
                    <img src="${recipe.image}" alt="${recipe.title}">
                    <button class="favorite-toggle" aria-label="Retirer des favoris" aria-pressed="true">♥</button>
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

        recipesGrid.querySelectorAll('.favorite-toggle').forEach(button => {
            button.addEventListener('click', () => {
                const recipeTitle = button.closest('.recipes-card').querySelector('h2').textContent;
                const index = favorites.findIndex(fav => fav.title === recipeTitle);
                if (index !== -1) {
                    favorites.splice(index, 1);
                    button.textContent = '♡';
                    button.setAttribute('aria-label', 'Ajouter aux favoris');
                    button.setAttribute('aria-pressed', 'false');
                    localStorage.setItem('favorites', JSON.stringify(favorites));
                    showConfirmationMessage('Recette retirée des favoris !');
                    updateFavoritesSection();
                }
            });
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    if (document.querySelector('.favorites-section')) {
        updateFavoritesSection();
    }
});
// === Messages de confirmation ===
function showConfirmationMessage(message, isSuccess = true) {
    const messageDiv = document.createElement('div');
    messageDiv.textContent = message;
    messageDiv.setAttribute('role', 'alert');
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

    document.body.appendChild(messageDiv);

    setTimeout(() => {
        messageDiv.style.opacity = '1';
    }, 10);

    setTimeout(() => {
        messageDiv.style.opacity = '0';
        setTimeout(() => {
            messageDiv.remove();
        }, 300);
    }, 3000);
}

// === Validation du formulaire de contact ===
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = contactForm.querySelector('#contact-name').value.trim();
        const email = contactForm.querySelector('#contact-email').value.trim();
        const message = contactForm.querySelector('#contact-message').value.trim();

        if (name === '' || email === '' || message === '') {
            showConfirmationMessage('Veuillez remplir tous les champs.', false);
            return;
        }

        if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            showConfirmationMessage('Veuillez entrer un email valide.', false);
            return;
        }

        showConfirmationMessage('Message envoyé avec succès !');
        contactForm.reset();
    });
}