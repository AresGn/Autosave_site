// Main JavaScript file

// Import modules
import { initNavigation } from './modules/navigation.js';
import { initSlider } from './modules/slider.js';
import { initForms } from './modules/form-validation.js';
import { initScrollEffects } from './modules/scroll-effects.js';
import { initAppsSlider } from './modules/apps-slider.js';

// Initialize all modules when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize navigation
    initNavigation();
    
    // Initialize testimonial slider
    initSlider();
    
    // Initialize form validation
    initForms();
    
    // Initialize scroll effects
    initScrollEffects();
    
    // Initialize applications slider
    initAppsSlider();
    
    // Add scroll to top button
    const scrollTopButton = document.createElement('button');
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.setAttribute('aria-label', 'Retour en haut');
    document.body.appendChild(scrollTopButton);
    
    // Show/hide scroll to top button
    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            scrollTopButton.classList.add('visible');
        } else {
            scrollTopButton.classList.remove('visible');
        }
    });
    
    // Scroll to top when button is clicked
    scrollTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}); 