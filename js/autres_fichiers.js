// autres_fichiers.js

// === Recherche ===
const searchInput = document.querySelector('#recipe-search');
const searchButton = document.querySelector('#search-button');

searchButton.addEventListener('click', () => {
    const query = searchInput.value.toLowerCase();
    const recipeCards = document.querySelectorAll('.recipes-card');

    recipeCards.forEach(card => {
        const title = card.querySelector('h2').textContent.toLowerCase();
        if (title.includes(query)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
});

// === Filtres ===
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const recipeCards = document.querySelectorAll('.recipes-card');
        const activeCategories = Array.from(document.querySelectorAll('input[name="categorie"]:checked')).map(cb => cb.value);
        const activeDifficulties = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(cb => cb.value);

        recipeCards.forEach(card => {
            const category = card.querySelector('.tag.category').textContent.toLowerCase();
            const difficulty = card.querySelector('.tag.difficulty').textContent.toLowerCase();

            const matchesCategory = activeCategories.length === 0 || activeCategories.includes(category);
            const matchesDifficulty = activeDifficulties.length === 0 || activeDifficulties.includes(difficulty);

            if (matchesCategory && matchesDifficulty) {
                card.style.display = 'block';
            } else {
                card.style.display = 'none';
            }
        });
    });
});

// === Changement de thème ===
const themeToggle = document.querySelector('#menu-toggle[aria-label="Changer de thème"]');
let isDarkTheme = false;

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    if (isDarkTheme) {
        document.documentElement.style.setProperty('--background-color', '#333');
        document.documentElement.style.setProperty('--text-color', '#fff');
        document.documentElement.style.setProperty('--white', '#444');
        themeToggle.querySelector('.moon-icon').textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Passer au thème clair');
    } else {
        document.documentElement.style.setProperty('--background-color', '#f9f9f9');
        document.documentElement.style.setProperty('--text-color', '#333');
        document.documentElement.style.setProperty('--white', '#fff');
        themeToggle.querySelector('.moon-icon').textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Passer au thème sombre');
    }
});