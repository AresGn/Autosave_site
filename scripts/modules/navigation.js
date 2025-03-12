/**
 * Navigation module
 * Handles all navigation-related functionality
 */

export function initNavigation() {
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelectorAll('.header__nav-item a');
    
    // Handle sticky header
    window.addEventListener('scroll', () => {
        header.classList.toggle('header--sticky', window.scrollY > 100);
    });
    
    // Mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.header__nav') && !e.target.closest('.menu-toggle')) {
                closeMenu();
            }
        });

        // Close menu when clicking links
        navLinks.forEach(link => {
            link.addEventListener('click', closeMenu);
        });
    }

    function toggleMenu() {
        const isOpen = header.classList.toggle('header--menu-open');
        document.body.classList.toggle('no-scroll', isOpen);
        menuToggle.setAttribute('aria-expanded', isOpen);
    }

    function closeMenu() {
        header.classList.remove('header--menu-open');
        document.body.classList.remove('no-scroll');
        menuToggle.setAttribute('aria-expanded', 'false');
    }
}