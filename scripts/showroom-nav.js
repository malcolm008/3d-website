// showroom-nav.js - Navigation specifically for 3D Showroom Page

class ShowroomNavigation {
    constructor() {
        this.isVisible = false;
        this.isMobile = window.innerWidth < 769;
        this.hideTimeout = null;
        this.lastInteractionTime = Date.now();
        this.interactionThreshold = 3000; // 3 seconds
        
        this.init();
    }

    init() {
        this.createNavigation();
        this.setupEventListeners();
        this.setupAutoHide();
    }

    createNavigation() {
        const navHTML = `
        <nav class="showroom-nav">
            <!-- Logo and Theme Toggle -->
            <div class="nav-top">
                <div class="logo-container">
                    <img src="logos/CRIPTQ2-04.png" alt="Logo" class="nav-logo">
                    <span class="brand-name">SHOWROOM</span>
                </div>
                <button class="nav-theme-toggle" id="showroom-theme-toggle">
                    <i class="fas fa-adjust"></i>
                </button>
            </div>

            <!-- Main Navigation (Desktop) -->
            <div class="nav-main">
                <ul class="nav-links">
                    <li><a href="index.html" class="nav-link" data-page="home">
                        <span>Home</span>
                    </a></li>
                    <li><a href="index.html#cars" class="nav-link" data-page="cars">
                        <span>Cars</span>
                    </a></li>
                    <li><a href="#" class="nav-link active" data-page="showroom">
                        <span>Showroom</span>
                    </a></li>
                    <li><a href="index.html#fuels" class="nav-link" data-page="fuels">
                        <span>Fuels</span>
                    </a></li>
                    <li><a href="index.html#services" class="nav-link" data-page="services">
                        <span>Services</span>
                    </a></li>
                </ul>
            </div>

            <!-- Quick Actions -->
            <div class="nav-actions">
                <button class="nav-action-btn" id="toggle-ui">
                    <i class="fas fa-eye"></i>
                    <span>Toggle UI</span>
                </button>
                <button class="nav-action-btn" id="fullscreen-btn">
                    <i class="fas fa-expand"></i>
                    <span>Fullscreen</span>
                </button>
            </div>

            <!-- Mobile Menu Button -->
            <div class="mobile-nav-toggle" id="mobile-nav-toggle">
                <div class="hamburger">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>

            <!-- Mobile Menu Overlay -->
            <div class="mobile-nav-overlay" id="mobile-nav-overlay">
                <div class="mobile-nav-content">
                    <div class="mobile-nav-header">
                        <img src="logos/CRIPTQ2-04.png" alt="Logo" class="mobile-logo">
                        <span class="mobile-brand">3D SHOWROOM</span>
                        <button class="mobile-close" id="mobile-close">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                    <ul class="mobile-nav-links">
                        <li><a href="index.html" class="mobile-nav-link">
                            <span>Home</span>
                        </a></li>
                        <li><a href="index.html#cars" class="mobile-nav-link">
                            <span>Cars</span>
                        </a></li>
                        <li><a href="showroom.html" class="mobile-nav-link active">
                            <span>Showroom</span>
                        </a></li>
                        <li><a href="index.html#fuels" class="mobile-nav-link">
                            <span>Fuels</span>
                        </a></li>
                        <li><a href="index.html#services" class="mobile-nav-link">
                            <span>Services</span>
                        </a></li>
                        <li><a href="index.html#contact" class="mobile-nav-link">
                            <span>Contact</span>
                        </a></li>
                    </ul>
                    <div class="mobile-actions">
                        <button class="mobile-action-btn" id="mobile-toggle-ui">
                            <i class="fas fa-eye"></i>
                            <span>Toggle UI</span>
                        </button>
                        <button class="mobile-action-btn" id="mobile-fullscreen">
                            <i class="fas fa-expand"></i>
                            <span>Fullscreen</span>
                        </button>
                    </div>
                </div>
            </div>
        </nav>
        `;

        document.body.insertAdjacentHTML('afterbegin', navHTML);
        this.showNavigation();
    }

    setupEventListeners() {
        const nav = document.querySelector('.showroom-nav');
        const mobileToggle = document.getElementById('mobile-nav-toggle');
        const mobileOverlay = document.getElementById('mobile-nav-overlay');
        const mobileClose = document.getElementById('mobile-close');
        const themeToggle = document.getElementById('showroom-theme-toggle');
        const fullscreenBtn = document.getElementById('fullscreen-btn');
        const mobileFullscreen = document.getElementById('mobile-fullscreen');
        const toggleUiBtn = document.getElementById('toggle-ui');
        const mobileToggleUi = document.getElementById('mobile-toggle-ui');
        const videoBackground = document.getElementById('video-background');

        // Mouse movement detection for desktop
        if (!this.isMobile) {
            document.addEventListener('mousemove', (e) => {
                if (e.clientY < 100) { // Show when mouse near top
                    this.showNavigation();
                } else if (e.clientY > 200 && this.isVisible) {
                    this.hideNavigation();
                }
            });
        }

        // Touch events for mobile
        let lastTap = 0;
        document.addEventListener('touchstart', (e) => {
            if (e.touches[0].clientY < 100) {
                this.showNavigation();
            }
            
            // Double tap to toggle
            const currentTime = Date.now();
            const tapLength = currentTime - lastTap;
            if (tapLength < 300 && tapLength > 0) {
                this.toggleNavigation();
                e.preventDefault();
            }
            lastTap = currentTime;
        });

        // Mobile menu toggle
        if (mobileToggle) {
            mobileToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileOverlay.classList.add('active');
                this.resetAutoHide();
            });
        }

        if (mobileClose) {
            mobileClose.addEventListener('click', () => {
                mobileOverlay.classList.remove('active');
            });
        }

        // Close mobile menu when clicking outside
        if (mobileOverlay) {
            mobileOverlay.addEventListener('click', (e) => {
                if (e.target === mobileOverlay) {
                    mobileOverlay.classList.remove('active');
                }
            });
        }

        // Theme toggle
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
                this.resetAutoHide();
            });
        }

        // Fullscreen toggle
        if (fullscreenBtn) {
            fullscreenBtn.addEventListener('click', () => {
                this.toggleFullscreen();
                this.resetAutoHide();
            });
        }

        if (mobileFullscreen) {
            mobileFullscreen.addEventListener('click', () => {
                this.toggleFullscreen();
                mobileOverlay.classList.remove('active');
            });
        }

        // UI Toggle (for hiding/showing UI elements in showroom)
        if (toggleUiBtn) {
            toggleUiBtn.addEventListener('click', () => {
                this.toggleShowroomUI();
                this.resetAutoHide();
            });
        }

        if (mobileToggleUi) {
            mobileToggleUi.addEventListener('click', () => {
                this.toggleShowroomUI();
                mobileOverlay.classList.remove('active');
            });
        }

        // Interaction tracking
        const interactiveElements = [nav, mobileToggle, themeToggle, fullscreenBtn, toggleUiBtn];
        interactiveElements.forEach(el => {
            if (el) {
                el.addEventListener('click', () => this.resetAutoHide());
                el.addEventListener('touchstart', () => this.resetAutoHide());
            }
        });

        // Video controls interaction
        const videoControls = document.querySelector('.video-controls');
        if (videoControls) {
            videoControls.addEventListener('click', () => this.resetAutoHide());
        }

        // Navigation links
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (!link.classList.contains('active')) {
                    // Add loading indicator
                    document.body.style.cursor = 'wait';
                    setTimeout(() => {
                        document.body.style.cursor = 'default';
                    }, 500);
                }
                this.resetAutoHide();
            });
        });

        // Window resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth < 769;
            if (this.isMobile) {
                this.showNavigation(); // Keep visible on mobile
            }
        });
    }

    setupAutoHide() {
        // Auto-hide after 5 seconds of inactivity
        setInterval(() => {
            if (this.isVisible && !this.isMobile) {
                const currentTime = Date.now();
                const timeSinceInteraction = currentTime - this.lastInteractionTime;
                
                if (timeSinceInteraction > this.interactionThreshold) {
                    this.hideNavigation();
                }
            }
        }, 1000);
    }

    resetAutoHide() {
        this.lastInteractionTime = Date.now();
        if (!this.isVisible) {
            this.showNavigation();
        }
    }

    showNavigation() {
        if (this.hideTimeout) {
            clearTimeout(this.hideTimeout);
        }

        const nav = document.querySelector('.showroom-nav');
        if (nav && !nav.classList.contains('visible')) {
            nav.classList.add('visible');
            this.isVisible = true;
            
            // Auto-hide after 3 seconds on desktop
            if (!this.isMobile) {
                this.hideTimeout = setTimeout(() => {
                    this.hideNavigation();
                }, 3000);
            }
        }
    }

    hideNavigation() {
        const nav = document.querySelector('.showroom-nav');
        if (nav && nav.classList.contains('visible') && !this.isMobile) {
            nav.classList.remove('visible');
            this.isVisible = false;
        }
    }

    toggleNavigation() {
        if (this.isVisible) {
            this.hideNavigation();
        } else {
            this.showNavigation();
        }
    }

    toggleTheme() {
        const isDarkMode = document.body.classList.contains('dark-mode');
        const themeIcon = document.querySelector('#showroom-theme-toggle i');
        
        if (isDarkMode) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            themeIcon.className = 'fas fa-moon';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            themeIcon.className = 'fas fa-sun';
        }
        
        // Update logo for theme
        const logos = document.querySelectorAll('.nav-logo, .mobile-logo');
        logos.forEach(logo => {
            const isDark = document.body.classList.contains('dark-mode');
            logo.src = isDark ? 'logos/CRIPTQ2-04.png' : 'logos/CRIPTQ2-02.png';
        });
    }

    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.log('Fullscreen error:', err);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    toggleShowroomUI() {
        // Toggle all UI elements in the showroom except navigation
        const uiElements = [
            '.model-selector',
            '.car-info',
            '.navigation',
            '.video-controls'
        ];
        
        let allHidden = true;
        
        uiElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                if (el.style.display !== 'none') {
                    el.style.display = 'none';
                    allHidden = false;
                } else {
                    el.style.display = '';
                }
            });
        });
        
        // Update button text
        const buttons = document.querySelectorAll('#toggle-ui, #mobile-toggle-ui');
        buttons.forEach(btn => {
            const icon = btn.querySelector('i');
            const text = btn.querySelector('span');
            if (allHidden) {
                icon.className = 'fas fa-eye-slash';
                text.textContent = 'Show UI';
            } else {
                icon.className = 'fas fa-eye';
                text.textContent = 'Hide UI';
            }
        });
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ShowroomNavigation();
});