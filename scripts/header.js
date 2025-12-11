// header.js - Reusable Navigation Component with Enhanced Theme Toggle

class NavigationHeader {
    constructor() {
        this.containerId = 'header-container';
        this.theme = localStorage.getItem('theme') || 'light';
        this.currentPage = window.location.pathname.split('/').pop() || 'index.html';
        
        // Logo paths
        this.darkLogo = 'logos/CRIPTQ2-04.png';
        this.lightLogo = 'logos/CRIPTQ2-02.png';
        
        this.init();
    }

    init() {
        // Apply theme before creating header (for logo)
        this.applyTheme();
        // Create header HTML
        this.createHeader();
        // Set up event listeners
        this.setupEventListeners();
        // Set active navigation link
        this.setActiveLink();
    }

    createHeader() {
        // Determine initial theme icon
        const initialThemeIcon = this.theme === 'dark' ? 'fa-sun' : 'fa-moon';
        
        const headerHTML = `
        <header>
            <div class="container header-container">
                <a href="index.html" class="logo">
                    <img id="logo-img" src="${this.theme === 'dark' ? this.darkLogo : this.lightLogo}" alt="logo">
                </a>
                <div class="mobile-menu">
                    <i class="fas fa-bars"></i>
                </div>
                <nav class="nav-menu">
                    <ul>
                        <li><a href="index.html" data-page="home">Home</a></li>
                        <li><a href="#cars" data-page="cars">Cars</a></li>
                        <li><a href="#fuels" data-page="fuels">Fuels</a></li>
                        <li><a href="showroom.html" data-page="showroom">Showroom</a></li>
                        <li><a href="#services" data-page="services">Services</a></li>
                        <li><a href="#contact" data-page="contact">Contact</a></li>
                    </ul>
                </nav>
                <button class="theme-toggle" id="theme-toggle">
                    <i class="fas ${initialThemeIcon}"></i>
                </button>
            </div>
        </header>
        `;

        // Insert header at the beginning of body or in specified container
        const container = document.getElementById(this.containerId) || document.body;
        container.insertAdjacentHTML('afterbegin', headerHTML);
    }

    setupEventListeners() {
        // Mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu');
        const navMenu = document.querySelector('.nav-menu');

        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', () => {
                navMenu.classList.toggle('active');
                mobileMenuBtn.classList.toggle('active');
            });
        }

        // Theme toggle
        const themeToggle = document.getElementById('theme-toggle');
        const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;
        const logoImg = document.getElementById('logo-img');

        if (themeToggle && themeIcon && logoImg) {
            themeToggle.addEventListener('click', () => this.toggleTheme(themeIcon, logoImg));
        }

        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-menu a');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navMenu) navMenu.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            });
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (navMenu && mobileMenuBtn) {
                if (!e.target.closest('.nav-menu') && !e.target.closest('.mobile-menu')) {
                    navMenu.classList.remove('active');
                    mobileMenuBtn.classList.remove('active');
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && navMenu) {
                navMenu.classList.remove('active');
                if (mobileMenuBtn) mobileMenuBtn.classList.remove('active');
            }
        });
    }

    updateLogo(isDarkMode, logoImg) {
        if (logoImg) {
            logoImg.src = isDarkMode ? this.darkLogo : this.lightLogo;
            // Optional: Add fade transition
            logoImg.style.opacity = '0.7';
            setTimeout(() => {
                logoImg.style.opacity = '1';
            }, 150);
        }
    }

    toggleTheme(themeIcon, logoImg) {
        // Toggle dark mode class on body
        document.body.classList.toggle('dark-mode');
        
        // Update theme variable
        if (document.body.classList.contains('dark-mode')) {
            this.theme = 'dark';
            localStorage.setItem('theme', 'dark');
            
            // Update theme icon
            if (themeIcon) {
                themeIcon.classList.remove('fa-moon');
                themeIcon.classList.add('fa-sun');
            }
            
            // Update logo
            this.updateLogo(true, logoImg);
            
            // Add dark theme class for header specific styles
            document.body.classList.add('dark-theme');
        } else {
            this.theme = 'light';
            localStorage.setItem('theme', 'light');
            
            // Update theme icon
            if (themeIcon) {
                themeIcon.classList.remove('fa-sun');
                themeIcon.classList.add('fa-moon');
            }
            
            // Update logo
            this.updateLogo(false, logoImg);
            
            // Remove dark theme class
            document.body.classList.remove('dark-theme');
        }
        
        // Dispatch custom event for theme change
        document.dispatchEvent(new CustomEvent('themeChanged', { 
            detail: { theme: this.theme } 
        }));
        
        // Optional: Add toggle animation
        if (themeIcon) {
            themeIcon.style.transform = 'rotate(360deg)';
            setTimeout(() => {
                themeIcon.style.transform = 'rotate(0)';
            }, 300);
        }
    }

    applyTheme() {
        if (this.theme === 'dark') {
            document.body.classList.add('dark-mode');
            document.body.classList.add('dark-theme');
        }
    }

    setActiveLink() {
        const links = document.querySelectorAll('.nav-menu a');
        links.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            const linkHref = link.getAttribute('href');
            
            // Check if this link corresponds to current page
            if (this.currentPage.includes(linkPage) || 
                (this.currentPage === 'index.html' && linkPage === 'home') ||
                (this.currentPage === '' && linkPage === 'home') ||
                (linkHref && linkHref.includes(this.currentPage))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Method to manually update logo (in case it changes dynamically)
    updateLogos(darkLogoPath, lightLogoPath) {
        if (darkLogoPath) this.darkLogo = darkLogoPath;
        if (lightLogoPath) this.lightLogo = lightLogoPath;
        
        // Update current logo if it exists
        const logoImg = document.getElementById('logo-img');
        if (logoImg) {
            logoImg.src = this.theme === 'dark' ? this.darkLogo : this.lightLogo;
        }
    }

    // Static method to load header on any page
    static load() {
        if (!window.navigationHeader) {
            window.navigationHeader = new NavigationHeader();
        }
        return window.navigationHeader;
    }
}

// Auto-load when script is imported
document.addEventListener('DOMContentLoaded', () => {
    NavigationHeader.load();
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NavigationHeader;
}