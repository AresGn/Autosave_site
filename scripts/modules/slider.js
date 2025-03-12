/**
 * Module pour gérer le slider des témoignages
 */

export function initSlider() {
    const slider = document.querySelector('.testimonials__slider');
    if (!slider) return;

    const track = slider.querySelector('.testimonials__track');
    const slides = slider.querySelectorAll('.testimonial');
    const dotsContainer = slider.querySelector('.testimonials__dots');
    
    let currentIndex = 0;
    let autoplayInterval;
    
    // Initialisation
    function init() {
        // Créer les points de navigation
        if (dotsContainer) {
            createDots();
        }
        
        // Démarrer l'autoplay
        startAutoplay();
    }
    
    // Créer les points de navigation
    function createDots() {
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < slides.length; i++) {
            const dot = document.createElement('button');
            dot.classList.add('testimonials__dot');
            dot.setAttribute('aria-label', `Voir le témoignage ${i + 1}`);
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(i);
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Afficher un slide spécifique
    function goToSlide(index) {
        // Masquer tous les slides
        slides.forEach(slide => {
            slide.style.display = 'none';
            slide.style.opacity = '0';
        });
        
        // Afficher le slide sélectionné
        slides[index].style.display = 'block';
        setTimeout(() => {
            slides[index].style.opacity = '1';
        }, 50);
        
        // Mettre à jour l'index courant
        currentIndex = index;
        
        // Mettre à jour les points de navigation
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.testimonials__dot');
            dots.forEach((dot, i) => {
                dot.classList.toggle('active', i === index);
            });
        }
        
        // Réinitialiser l'autoplay
        resetAutoplay();
    }
    
    // Aller au slide suivant
    function goToNextSlide() {
        const nextIndex = (currentIndex + 1) % slides.length;
        goToSlide(nextIndex);
    }
    
    // Démarrer l'autoplay
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        autoplayInterval = setInterval(() => {
            goToNextSlide();
        }, 5000); // Changer de slide toutes les 5 secondes
    }
    
    // Réinitialiser l'autoplay
    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        startAutoplay();
    }
    
    // Initialiser
    init();
    
    // Afficher le premier slide
    goToSlide(0);
} 