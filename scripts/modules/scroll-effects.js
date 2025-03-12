/**
 * Scroll effects module
 * Handles scroll-based animations and effects
 */

export function initScrollEffects() {
    // Get all elements that should animate on scroll
    const animatedElements = document.querySelectorAll('.feature-card, .detailed-feature, .step, .spec, .support-card');
    
    // Set up Intersection Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Add animation class when element is in viewport
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-slide-bottom');
                
                // Unobserve after animation is added
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: null, // viewport
        threshold: 0.1, // 10% of element must be visible
        rootMargin: '0px 0px -50px 0px' // trigger slightly before element is in view
    });
    
    // Observe each element
    animatedElements.forEach(element => {
        // Remove any existing animation classes
        element.classList.remove('animate-slide-bottom');
        
        // Observe element
        observer.observe(element);
    });
    
    // Add parallax effect to hero section
    const heroSection = document.querySelector('.hero');
    const heroImage = document.querySelector('.hero__image');
    
    if (heroSection && heroImage) {
        window.addEventListener('scroll', () => {
            // Calculate how far we've scrolled into the hero section
            const scrollPosition = window.scrollY;
            const heroHeight = heroSection.offsetHeight;
            
            // Only apply parallax if we're in the hero section
            if (scrollPosition <= heroHeight) {
                // Move the image slightly as we scroll
                const parallaxValue = scrollPosition * 0.2;
                heroImage.style.transform = `translateY(${parallaxValue}px)`;
            }
        });
    }
    
    // Add highlight effect to active section in navigation
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.header__nav-item a');
    
    window.addEventListener('scroll', () => {
        // Get current scroll position
        const scrollPosition = window.scrollY + 100; // Add offset for header
        
        // Find the current active section
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                // Remove active class from all links
                navLinks.forEach(link => {
                    link.classList.remove('active');
                });
                
                // Add active class to corresponding link
                const activeLink = document.querySelector(`.header__nav-item a[href="#${sectionId}"]`);
                if (activeLink) {
                    activeLink.classList.add('active');
                }
            }
        });
    });
    
    // Add counter animation to numbers
    const counters = document.querySelectorAll('.counter');
    
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const target = parseInt(counter.getAttribute('data-target'), 10);
                    const duration = 2000; // 2 seconds
                    const step = Math.ceil(target / (duration / 16)); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += step;
                        if (current >= target) {
                            counter.textContent = target;
                        } else {
                            counter.textContent = current;
                            requestAnimationFrame(updateCounter);
                        }
                    };
                    
                    updateCounter();
                    counterObserver.unobserve(counter);
                }
            });
        }, {
            threshold: 0.5
        });
        
        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }
} 