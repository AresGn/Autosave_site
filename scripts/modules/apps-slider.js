/**
 * Module pour gérer le slider des applications supportées
 */

export function initAppsSlider() {
    const slider = document.querySelector('.apps-slider');
    if (!slider) return;

    const track = slider.querySelector('.apps-slider__track');
    const slides = slider.querySelectorAll('.app-slide');
    const dotsContainer = slider.querySelector('.apps-slider__dots');
    
    let currentIndex = 0;
    let slidesPerView = 3;
    let slideWidth = 100 / slidesPerView;
    let touchStartX = 0;
    let touchEndX = 0;
    let autoplayInterval;
    let isAnimating = false;
    
    // Initialisation
    function init() {
        console.log("Initialisation du slider d'applications...");
        
        // Déterminer le nombre de slides visibles en fonction de la largeur de l'écran
        updateSlidesPerView();
        
        // Créer les points de navigation
        createDots();
        
        // Positionner les slides
        updateSlidePositions();
        
        // Ajouter les écouteurs d'événements
        addEventListeners();
        
        // Démarrer l'autoplay
        startAutoplay();
        
        console.log("Slider d'applications initialisé avec succès!");
    }
    
    // Mettre à jour le nombre de slides visibles en fonction de la largeur de l'écran
    function updateSlidesPerView() {
        if (window.innerWidth <= 480) {
            slidesPerView = 1;
        } else if (window.innerWidth <= 768) {
            slidesPerView = 2;
        } else {
            slidesPerView = 3;
        }
        slideWidth = 100 / slidesPerView;
        
        // Mettre à jour la largeur des slides
        slides.forEach(slide => {
            slide.style.flex = `0 0 ${slideWidth}%`;
            slide.style.minWidth = `${slideWidth}%`;
        });
        
        console.log(`Slides par vue: ${slidesPerView}, Largeur de slide: ${slideWidth}%`);
    }
    
    // Créer les points de navigation
    function createDots() {
        if (!dotsContainer) return;
        
        dotsContainer.innerHTML = ''; // Vider le conteneur avant de créer les points
        
        const totalDots = Math.ceil(slides.length / slidesPerView);
        console.log(`Création de ${totalDots} points de navigation`);
        
        for (let i = 0; i < totalDots; i++) {
            const dot = document.createElement('button');
            dot.classList.add('apps-slider__dot');
            dot.setAttribute('aria-label', `Voir les applications ${i * slidesPerView + 1} à ${Math.min((i + 1) * slidesPerView, slides.length)}`);
            
            if (i === 0) {
                dot.classList.add('active');
            }
            
            dot.addEventListener('click', () => {
                goToSlide(i * slidesPerView);
                resetAutoplay();
            });
            
            dotsContainer.appendChild(dot);
        }
    }
    
    // Mettre à jour la position des slides
    function updateSlidePositions() {
        // Appliquer la transformation au track
        track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
        console.log(`Déplacement du track à: -${currentIndex * slideWidth}%`);
        
        // Mettre à jour les points de navigation
        if (dotsContainer) {
            const dots = dotsContainer.querySelectorAll('.apps-slider__dot');
            const activeDotIndex = Math.floor(currentIndex / slidesPerView);
            
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === activeDotIndex);
            });
        }
    }
    
    // Aller à un slide spécifique
    function goToSlide(index) {
        if (isAnimating) return;
        isAnimating = true;
        
        const maxIndex = slides.length - slidesPerView;
        currentIndex = Math.max(0, Math.min(index, maxIndex));
        
        console.log(`Déplacement au slide ${currentIndex}`);
        updateSlidePositions();
        
        // Permettre une nouvelle animation après la transition
        setTimeout(() => {
            isAnimating = false;
        }, 800); // Correspond à la durée de transition CSS
    }
    
    // Aller au slide suivant
    function goToNextSlide() {
        let nextIndex = currentIndex + slidesPerView;
        
        // Revenir au début si on atteint la fin
        if (nextIndex >= slides.length - slidesPerView + 1) {
            nextIndex = 0;
        }
        
        console.log(`Déplacement au slide suivant: ${nextIndex}`);
        goToSlide(nextIndex);
    }
    
    // Aller au slide précédent
    function goToPrevSlide() {
        goToSlide(currentIndex - slidesPerView);
    }
    
    // Démarrer l'autoplay
    function startAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        
        console.log("Démarrage de l'autoplay");
        autoplayInterval = setInterval(() => {
            if (!isAnimating) {
                goToNextSlide();
            }
        }, 3000); // Changer de slide toutes les 3 secondes
    }
    
    // Réinitialiser l'autoplay
    function resetAutoplay() {
        if (autoplayInterval) {
            clearInterval(autoplayInterval);
        }
        startAutoplay();
    }
    
    // Ajouter les écouteurs d'événements
    function addEventListeners() {
        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            updateSlidesPerView();
            updateSlidePositions();
        });
        
        // Pause de l'autoplay au survol
        slider.addEventListener('mouseenter', () => {
            console.log("Pause de l'autoplay (survol)");
            clearInterval(autoplayInterval);
        });
        
        slider.addEventListener('mouseleave', () => {
            console.log("Reprise de l'autoplay");
            startAutoplay();
        });
        
        // Gestion du swipe sur mobile
        track.addEventListener('touchstart', handleTouchStart, { passive: true });
        track.addEventListener('touchend', handleTouchEnd, { passive: true });
    }
    
    // Gérer le début du toucher
    function handleTouchStart(e) {
        touchStartX = e.changedTouches[0].screenX;
    }
    
    // Gérer la fin du toucher
    function handleTouchEnd(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    }
    
    // Gérer le swipe
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold) {
            // Swipe vers la gauche
            goToNextSlide();
            resetAutoplay();
        } else if (touchEndX > touchStartX + swipeThreshold) {
            // Swipe vers la droite
            goToPrevSlide();
            resetAutoplay();
        }
    }
    
    // Initialiser le slider
    init();
} 