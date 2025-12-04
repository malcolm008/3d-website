const darkLogo = 'logos/CRIPTQ2-04.png';
const lightLogo = 'logos/CRIPTQ2-02.png';

// Get DOM elements
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const logoImg = document.getElementById('logo-img');
const mobileMenu = document.querySelector('.mobile-menu');
const navMenu = document.querySelector('.nav-menu');

// Function to update logo based on theme
function updateLogo(isDarkMode) {
    logoImg.src = isDarkMode ? darkLogo : lightLogo;
}

// Check for saved theme preference or default to light
const currentTheme = localStorage.getItem('theme') || 'light';
if (currentTheme === 'dark') {
    document.body.classList.add('dark-mode');
    themeIcon.classList.remove('fa-moon');
    themeIcon.classList.add('fa-sun');
    updateLogo(true);
} else {
    updateLogo(false);
}

// Theme toggle event listener
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    
    if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
        updateLogo(true);
    } else {
        localStorage.setItem('theme', 'light');
        themeIcon.classList.remove('fa-sun');
        themeIcon.classList.add('fa-moon');
        updateLogo(false);
    }
});

// Mobile menu toggle
mobileMenu.addEventListener('click', () => {
    navMenu.classList.toggle('active');
});
