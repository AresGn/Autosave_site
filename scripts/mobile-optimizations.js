/**
 * Optimisations mobiles pour AutoSavePro
 * Ce script améliore l'expérience utilisateur sur les appareils mobiles
 */

document.addEventListener('DOMContentLoaded', function() {
    // Détection des appareils mobiles
    const isMobile = window.innerWidth <= 767;
    const isTablet = window.innerWidth > 767 && window.innerWidth <= 991;
    
    // Ajout d'une classe au body pour les styles spécifiques
    if (isMobile) {
        document.body.classList.add('is-mobile');
    } else if (isTablet) {
        document.body.classList.add('is-tablet');
    }
    
    // Optimisation des images pour mobile
    if (isMobile || isTablet) {
        // Chargement différé des images non visibles
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        // Observer pour charger les images quand elles deviennent visibles
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src || img.src;
                        observer.unobserve(img);
                    }
                });
            });
            
            lazyImages.forEach(img => imageObserver.observe(img));
        }
    }
    
    // Amélioration du défilement sur mobile
    if (isMobile) {
        // Empêcher le zoom sur double-tap pour les éléments interactifs
        const interactiveElements = document.querySelectorAll('a, button, .app-slide, .testimonial');
        interactiveElements.forEach(el => {
            el.addEventListener('touchend', function(e) {
                // Ne pas empêcher le comportement par défaut pour les liens et boutons
                if (el.tagName !== 'A' && el.tagName !== 'BUTTON') {
                    e.preventDefault();
                }
            });
        });
    }
    
    // Optimisation des sliders pour mobile
    const appSlider = document.querySelector('.apps-slider');
    if (appSlider && (isMobile || isTablet)) {
        // Ajout de la gestion du swipe
        let touchStartX = 0;
        let touchEndX = 0;
        const track = appSlider.querySelector('.apps-slider__track');
        const slides = appSlider.querySelectorAll('.app-slide');
        const dotsContainer = appSlider.querySelector('.apps-slider__dots');
        let currentIndex = 0;
        let slidesPerView = getSlidesPerView();
        
        // Déterminer le nombre de slides visibles en fonction de la largeur de l'écran
        function getSlidesPerView() {
            if (window.innerWidth <= 480) {
                return 1;
            } else if (window.innerWidth <= 768) {
                return 2;
            } else {
                return 3;
            }
        }
        
        appSlider.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });
        
        appSlider.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
        
        function handleSwipe() {
            const swipeThreshold = 50;
            if (touchEndX < touchStartX - swipeThreshold) {
                // Swipe gauche - slide suivant
                goToNextSlide();
            } else if (touchEndX > touchStartX + swipeThreshold) {
                // Swipe droite - slide précédent
                goToPrevSlide();
            }
        }
        
        function goToNextSlide() {
            const maxIndex = slides.length - slidesPerView;
            currentIndex = Math.min(currentIndex + 1, maxIndex);
            updateSliderPosition();
        }
        
        function goToPrevSlide() {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateSliderPosition();
        }
        
        function updateSliderPosition() {
            if (track) {
                const slideWidth = 100 / slidesPerView;
                track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
                
                // Mettre à jour les points de navigation si présents
                if (dotsContainer) {
                    const dots = dotsContainer.querySelectorAll('.apps-slider__dot');
                    const activeDotIndex = Math.floor(currentIndex / slidesPerView);
                    
                    dots.forEach((dot, index) => {
                        dot.classList.toggle('active', index === activeDotIndex);
                    });
                }
            }
        }
        
        // Mettre à jour le slider lors du redimensionnement
        window.addEventListener('resize', function() {
            slidesPerView = getSlidesPerView();
            updateSliderPosition();
        });
        
        // Initialiser les points de navigation si nécessaire
        if (dotsContainer && !dotsContainer.children.length) {
            const totalDots = Math.ceil(slides.length / slidesPerView);
            
            for (let i = 0; i < totalDots; i++) {
                const dot = document.createElement('button');
                dot.classList.add('apps-slider__dot');
                dot.setAttribute('aria-label', `Voir les applications ${i * slidesPerView + 1} à ${Math.min((i + 1) * slidesPerView, slides.length)}`);
                
                if (i === 0) {
                    dot.classList.add('active');
                }
                
                dot.addEventListener('click', () => {
                    currentIndex = i * slidesPerView;
                    updateSliderPosition();
                });
                
                dotsContainer.appendChild(dot);
            }
        }
    }
    
    // Optimisation du slider de témoignages
    const testimonialSlider = document.querySelector('.testimonials__slider');
    if (testimonialSlider) {
        const testimonials = testimonialSlider.querySelectorAll('.testimonial');
        const dotsContainer = testimonialSlider.querySelector('.testimonials__dots');
        let currentTestimonial = 0;
        
        // Afficher le premier témoignage
        if (testimonials.length > 0) {
            testimonials[0].style.display = 'block';
            testimonials[0].style.opacity = '1';
        }
        
        // Créer les points de navigation si nécessaire
        if (dotsContainer && !dotsContainer.children.length) {
            for (let i = 0; i < testimonials.length; i++) {
                const dot = document.createElement('button');
                dot.classList.add('testimonials__dot');
                dot.setAttribute('aria-label', `Témoignage ${i + 1}`);
                
                if (i === 0) {
                    dot.classList.add('active');
                }
                
                dot.addEventListener('click', () => {
                    showTestimonial(i);
                });
                
                dotsContainer.appendChild(dot);
            }
        }
        
        // Fonction pour afficher un témoignage spécifique
        function showTestimonial(index) {
            // Masquer tous les témoignages
            testimonials.forEach(testimonial => {
                testimonial.style.display = 'none';
                testimonial.style.opacity = '0';
            });
            
            // Afficher le témoignage sélectionné
            testimonials[index].style.display = 'block';
            setTimeout(() => {
                testimonials[index].style.opacity = '1';
            }, 10);
            
            // Mettre à jour les points de navigation
            if (dotsContainer) {
                const dots = dotsContainer.querySelectorAll('.testimonials__dot');
                dots.forEach((dot, i) => {
                    dot.classList.toggle('active', i === index);
                });
            }
            
            currentTestimonial = index;
        }
        
        // Ajouter la gestion du swipe pour les témoignages
        if (isMobile || isTablet) {
            let touchStartX = 0;
            let touchEndX = 0;
            
            testimonialSlider.addEventListener('touchstart', function(e) {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            testimonialSlider.addEventListener('touchend', function(e) {
                touchEndX = e.changedTouches[0].screenX;
                handleTestimonialSwipe();
            }, { passive: true });
            
            function handleTestimonialSwipe() {
                const swipeThreshold = 50;
                if (touchEndX < touchStartX - swipeThreshold) {
                    // Swipe gauche - témoignage suivant
                    const nextIndex = (currentTestimonial + 1) % testimonials.length;
                    showTestimonial(nextIndex);
                } else if (touchEndX > touchStartX + swipeThreshold) {
                    // Swipe droite - témoignage précédent
                    const prevIndex = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
                    showTestimonial(prevIndex);
                }
            }
        }
        
        // Rotation automatique des témoignages
        let autoplayInterval;
        
        function startAutoplay() {
            autoplayInterval = setInterval(() => {
                const nextIndex = (currentTestimonial + 1) % testimonials.length;
                showTestimonial(nextIndex);
            }, 5000); // Changer toutes les 5 secondes
        }
        
        function stopAutoplay() {
            clearInterval(autoplayInterval);
        }
        
        // Démarrer l'autoplay
        startAutoplay();
        
        // Arrêter l'autoplay au survol ou au toucher
        testimonialSlider.addEventListener('mouseenter', stopAutoplay);
        testimonialSlider.addEventListener('touchstart', stopAutoplay, { passive: true });
        
        // Reprendre l'autoplay quand on quitte
        testimonialSlider.addEventListener('mouseleave', startAutoplay);
        testimonialSlider.addEventListener('touchend', function() {
            // Attendre un peu avant de redémarrer pour éviter les conflits avec le swipe
            setTimeout(startAutoplay, 1000);
        }, { passive: true });
    }
    
    // Amélioration de la performance sur mobile
    if (isMobile) {
        // Réduire les animations pour améliorer les performances
        document.body.classList.add('reduce-animations');
        
        // Ajouter un bouton de retour en haut de page
        const scrollTopButton = document.createElement('button');
        scrollTopButton.className = 'scroll-top';
        scrollTopButton.setAttribute('aria-label', 'Retour en haut');
        document.body.appendChild(scrollTopButton);
        
        // Afficher/masquer le bouton en fonction du défilement
        window.addEventListener('scroll', function() {
            if (window.scrollY > 500) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        });
        
        // Remonter en haut de page au clic sur le bouton
        scrollTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}); 