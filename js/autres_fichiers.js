// === Liste statique des recettes ===
const recipes = [
    {
        title: "Tarte aux pommes",
        category: "Dessert",
        time: "60 min",
        difficulty: "Facile",
        image: "assets/images/tarte_aux_pommes.jpg"
    },
    {
        title: "Ratatouille provençale",
        category: "Plat",
        time: "45 min",
        difficulty: "Moyen",
        image: "assets/images/ratatouille_provencale.jpg"
    },
    {
        title: "Velouté de potiron",
        category: "Entrée",
        time: "30 min",
        difficulty: "Facile",
        image: "assets/images/veloute_de_potiron.jpg"
    }
];

// === Recherche ===
const searchInput = document.querySelector('#recipe-search');
const searchButton = document.querySelector('#search-button');

if (searchButton) {
    searchButton.addEventListener('click', () => {
        const query = searchInput.value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const recipeElements = document.querySelectorAll('.recipes-card, .recipe-details');

        recipeElements.forEach(element => {
            const title = element.querySelector('h2').textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            if (title.includes(query)) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    });
}

// === Filtres ===
const filterCheckboxes = document.querySelectorAll('.filter-options input[type="checkbox"]');

filterCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', () => {
        const recipeElements = document.querySelectorAll('.recipes-card, .recipe-details');
        const activeCategories = Array.from(document.querySelectorAll('input[name="categorie"]:checked')).map(cb => cb.value);
        const activeTimes = Array.from(document.querySelectorAll('input[name="prep-time"]:checked')).map(cb => cb.value);
        const activeDifficulties = Array.from(document.querySelectorAll('input[name="difficulty"]:checked')).map(cb => cb.value);

        recipeElements.forEach(element => {
            const categoryElement = element.querySelector('.tag.category');
            const timeElement = element.querySelector('.tag.time');
            const difficultyElement = element.querySelector('.tag.difficulty');

            // Vérifie que les éléments nécessaires existent
            if (!categoryElement || !timeElement || !difficultyElement) {
                element.style.display = 'none'; // Masque les éléments qui n’ont pas tous les tags
                return;
            }

            const category = categoryElement.textContent.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
            const time = timeElement.textContent.toLowerCase();
            const difficulty = difficultyElement.textContent.toLowerCase();

            const matchesCategory = activeCategories.length === 0 || activeCategories.includes(category);
            const matchesTime = activeTimes.length === 0 || activeTimes.includes(time === '60 min' ? 'long' : time === '45 min' ? 'moyen' : 'rapide');
            const matchesDifficulty = activeDifficulties.length === 0 || activeDifficulties.includes(difficulty);

            if (matchesCategory && matchesTime && matchesDifficulty) {
                element.style.display = 'block';
            } else {
                element.style.display = 'none';
            }
        });
    });
});

// === Changement de thème ===
const themeToggle = document.querySelector('#theme-toggle[aria-label="Changer de thème"]');
let isDarkTheme = localStorage.getItem('theme') === 'dark';

if (isDarkTheme) {
    document.documentElement.style.setProperty('--background-color', 'var(--dark-background)');
    document.documentElement.style.setProperty('--text-color', 'var(--dark-text)');
    document.documentElement.style.setProperty('--white', 'var(--dark-white)');
    themeToggle.querySelector('.moon-icon').textContent = '☀️';
    themeToggle.setAttribute('aria-label', 'Passer au thème clair');
}

themeToggle.addEventListener('click', () => {
    isDarkTheme = !isDarkTheme;
    if (isDarkTheme) {
        document.documentElement.style.setProperty('--background-color', 'var(--dark-background)');
        document.documentElement.style.setProperty('--text-color', 'var(--dark-text)');
        document.documentElement.style.setProperty('--white', 'var(--dark-white)');
        themeToggle.querySelector('.moon-icon').textContent = '☀️';
        themeToggle.setAttribute('aria-label', 'Passer au thème clair');
        localStorage.setItem('theme', 'dark');
    } else {
        document.documentElement.style.setProperty('--background-color', '#f9f9f9');
        document.documentElement.style.setProperty('--text-color', '#333');
        document.documentElement.style.setProperty('--white', '#fff');
        themeToggle.querySelector('.moon-icon').textContent = '🌙';
        themeToggle.setAttribute('aria-label', 'Passer au thème sombre');
        localStorage.setItem('theme', 'light');
    }
});