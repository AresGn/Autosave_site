/**
 * Navigation module
 * Handles all navigation-related functionality
 */

export function initNavigation() {
    // Get DOM elements
    const header = document.querySelector('.header');
    const menuToggle = document.querySelector('.menu-toggle');
    
    // Handle sticky header on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.classList.add('header--sticky');
        } else {
            header.classList.remove('header--sticky');
        }
    });
    
    // Handle mobile menu toggle
    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            header.classList.toggle('header--menu-open');
            document.body.classList.toggle('menu-open');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = header.classList.contains('header--menu-open');
            menuToggle.setAttribute('aria-expanded', isExpanded);
        });
    }
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.header__nav-item a');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            header.classList.remove('header--menu-open');
            document.body.classList.remove('menu-open');
            
            if (menuToggle) {
                menuToggle.setAttribute('aria-expanded', 'false');
            }
        });
    });
    
    // Handle smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Get header height for offset
                const headerHeight = header.offsetHeight;
                
                // Calculate position to scroll to
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - headerHeight;
                
                // Smooth scroll to target
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Handle dropdown menus if they exist
    const dropdownToggles = document.querySelectorAll('.dropdown__toggle');
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            
            const dropdown = toggle.closest('.dropdown');
            
            // Close all other dropdowns
            document.querySelectorAll('.dropdown--open').forEach(openDropdown => {
                if (openDropdown !== dropdown) {
                    openDropdown.classList.remove('dropdown--open');
                }
            });
            
            // Toggle current dropdown
            dropdown.classList.toggle('dropdown--open');
            
            // Toggle aria-expanded attribute for accessibility
            const isExpanded = dropdown.classList.contains('dropdown--open');
            toggle.setAttribute('aria-expanded', isExpanded);
        });
    });
    
    // Close dropdowns when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.dropdown')) {
            document.querySelectorAll('.dropdown--open').forEach(dropdown => {
                dropdown.classList.remove('dropdown--open');
                
                const toggle = dropdown.querySelector('.dropdown__toggle');
                if (toggle) {
                    toggle.setAttribute('aria-expanded', 'false');
                }
            });
        }
    });
} 