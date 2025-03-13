/**
 * Module de gestion des traductions et du changement de langue
 */

// Stockage des traductions
let translations = {};
let currentLanguage = 'fr'; // Langue par défaut

/**
 * Initialise le module de traduction
 */
export async function initLanguageSwitcher() {
    // Chargement des traductions
    await loadTranslations();
    
    // Gestion du clic sur le bouton de langue
    const languageToggle = document.getElementById('language-toggle');
    const languageDropdown = document.querySelector('.language-dropdown');
    
    if (languageToggle) {
        languageToggle.addEventListener('click', (e) => {
            e.preventDefault();
            languageDropdown.classList.toggle('show');
        });
    }
    
    // Fermeture du menu déroulant si on clique ailleurs
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            languageDropdown.classList.remove('show');
        }
    });
    
    // Gestion des clics sur les options de langue
    const languageOptions = document.querySelectorAll('.language-dropdown a');
    languageOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            e.preventDefault();
            const lang = option.getAttribute('data-lang');
            
            if (lang !== currentLanguage) {
                changeLanguage(lang);
                
                // Mettre à jour l'état actif
                languageOptions.forEach(opt => opt.classList.remove('active'));
                option.classList.add('active');
                
                // Mettre à jour l'affichage du bouton
                document.querySelector('.current-language').textContent = lang.toUpperCase();
            }
            
            languageDropdown.classList.remove('show');
        });
    });
    
    // Restaurer la langue précédemment sauvegardée
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && savedLanguage !== currentLanguage) {
        changeLanguage(savedLanguage);
        
        // Mettre à jour l'UI
        document.querySelector('.current-language').textContent = savedLanguage.toUpperCase();
        languageOptions.forEach(opt => {
            opt.classList.remove('active');
            if (opt.getAttribute('data-lang') === savedLanguage) {
                opt.classList.add('active');
            }
        });
    }
}

/**
 * Charge les fichiers de traduction
 */
async function loadTranslations() {
    try {
        // Déterminer si nous sommes dans une sous-page
        const isSubPage = window.location.pathname.includes('/pages/');
        const basePath = isSubPage ? '../' : '';
        
        // Charger les traductions françaises
        const frResponse = await fetch(`${basePath}translations/fr.json`);
        const frTranslations = await frResponse.json();
        translations.fr = frTranslations;
        
        // Charger les traductions anglaises
        const enResponse = await fetch(`${basePath}translations/en.json`);
        const enTranslations = await enResponse.json();
        translations.en = enTranslations;
        
        console.log('Translations loaded successfully');
    } catch (error) {
        console.error('Error loading translations:', error);
    }
}

/**
 * Change la langue du site
 * @param {string} lang - Code de langue (fr/en)
 */
function changeLanguage(lang) {
    if (!translations[lang]) {
        console.error(`Translations for ${lang} not found`);
        return;
    }
    
    currentLanguage = lang;
    
    // Sauvegarder la préférence de langue
    localStorage.setItem('preferred-language', lang);
    
    // Mettre à jour les éléments du DOM avec les nouvelles traductions
    updateNavigation(translations[lang].navigation);
    updateHeroSection(translations[lang].hero);
    updateFeaturesSection(translations[lang].features);
    updateAppsSection(translations[lang].apps);
    updateInstallationSection(translations[lang].installation);
    updateTechnicalSection(translations[lang].technical);
    updateTestimonialsSection(translations[lang].testimonials);
    updateDownloadSection(translations[lang].download);
    updateContactSection(translations[lang].contact);
    updateFooterSection(translations[lang].footer);
    
    // Mettre à jour les pages spécifiques si elles sont présentes
    const pathname = window.location.pathname;
    if (pathname.includes('/a-venir.html') || pathname.includes('/pages/a-venir.html')) {
        updateComingSoonPage(translations[lang].coming_soon_page);
    }
    
    if (pathname.includes('/faq.html') || pathname.includes('/pages/faq.html')) {
        updateFaqPage(translations[lang].faq_page);
    }
    
    console.log(`Language changed to ${lang}`);
}

/**
 * Met à jour la navigation
 */
function updateNavigation(navTranslations) {
    const navItems = document.querySelectorAll('.header__nav-list a');
    const isSubPage = window.location.pathname.includes('/pages/');
    
    navItems.forEach(item => {
        const href = item.getAttribute('href');
        
        // Navigation sur la page d'accueil
        if (href === '#features' || href === '../index.html#features') {
            item.textContent = navTranslations.features;
        } else if (href === '#apps' || href === '../index.html#apps') {
            item.textContent = navTranslations.apps;
        } else if (href === '#download' || href === '../index.html#download') {
            item.textContent = navTranslations.download;
        } 
        // Navigation vers la page "À venir"
        else if (href === 'pages/a-venir.html' || href === 'a-venir.html' || 
                (href === 'a-venir.html' && item.classList.contains('active'))) {
            item.textContent = navTranslations.coming_soon;
        }
        // Liens de FAQ
        else if (href === 'pages/faq.html' || href === 'faq.html' || 
                (href === 'faq.html' && item.classList.contains('active'))) {
            item.textContent = navTranslations.faq;
        }
    });
}

/**
 * Met à jour la section héro
 */
function updateHeroSection(heroTranslations) {
    const heroTitle = document.querySelector('.hero__title');
    const heroSubtitle = document.querySelector('.hero__subtitle');
    const downloadButton = document.querySelector('.hero__cta .button');
    const versionText = document.querySelector('.hero__version');
    
    if (heroTitle) heroTitle.textContent = heroTranslations.title;
    if (heroSubtitle) heroSubtitle.textContent = heroTranslations.subtitle;
    if (downloadButton) downloadButton.textContent = heroTranslations.download_button;
    if (versionText) versionText.textContent = heroTranslations.version;
}

/**
 * Met à jour la section des fonctionnalités
 */
function updateFeaturesSection(featuresTranslations) {
    const featuresTitle = document.querySelector('#features .section-title');
    if (featuresTitle) featuresTitle.textContent = featuresTranslations.title;
    
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        const title = card.querySelector('h3');
        const description = card.querySelector('p');
        
        if (title && title.textContent.includes('Protection')) {
            title.textContent = featuresTranslations.protection.title;
            description.textContent = featuresTranslations.protection.description;
        } else if (title && title.textContent.includes('Performance')) {
            title.textContent = featuresTranslations.performance.title;
            description.textContent = featuresTranslations.performance.description;
        } else if (title && title.textContent.includes('Sauvegarde')) {
            title.textContent = featuresTranslations.backup.title;
            description.textContent = featuresTranslations.backup.description;
        }
    });
}

/**
 * Met à jour la section des applications
 */
function updateAppsSection(appsTranslations) {
    const appsTitle = document.querySelector('#apps .section-title');
    if (appsTitle) appsTitle.textContent = appsTranslations.title;
    
    const appSlides = document.querySelectorAll('.app-slide');
    
    appSlides.forEach(slide => {
        const name = slide.querySelector('.app-slide__name');
        const description = slide.querySelector('.app-slide__description');
        const imgAlt = slide.querySelector('.app-slide__img').getAttribute('alt').toLowerCase();
        
        if (!name || !description) return;
        
        if (imgAlt.includes('word') && !imgAlt.includes('wordpad')) {
            name.textContent = appsTranslations.word.name;
            description.textContent = appsTranslations.word.description;
        } else if (imgAlt.includes('excel')) {
            name.textContent = appsTranslations.excel.name;
            description.textContent = appsTranslations.excel.description;
        } else if (imgAlt.includes('powerpoint')) {
            name.textContent = appsTranslations.powerpoint.name;
            description.textContent = appsTranslations.powerpoint.description;
        } else if (imgAlt.includes('onenote')) {
            name.textContent = appsTranslations.onenote.name;
            description.textContent = appsTranslations.onenote.description;
        } else if (imgAlt.includes('notepad')) {
            name.textContent = appsTranslations.notepad.name;
            description.textContent = appsTranslations.notepad.description;
        } else if (imgAlt.includes('vscode')) {
            name.textContent = appsTranslations.vscode.name;
            description.textContent = appsTranslations.vscode.description;
        } else if (imgAlt.includes('wordpad')) {
            name.textContent = appsTranslations.wordpad.name;
            description.textContent = appsTranslations.wordpad.description;
        }
    });
}

/**
 * Met à jour la section d'installation
 */
function updateInstallationSection(installationTranslations) {
    const installationTitle = document.querySelector('.installation .section-title');
    const caption = document.querySelector('.installation__caption');
    
    if (installationTitle) installationTitle.textContent = installationTranslations.title;
    if (caption) caption.textContent = installationTranslations.caption;
}

/**
 * Met à jour la section technique
 */
function updateTechnicalSection(technicalTranslations) {
    const technicalTitle = document.querySelector('.technical .section-title');
    if (technicalTitle) technicalTitle.textContent = technicalTranslations.title;
    
    const specs = document.querySelectorAll('.spec');
    
    specs.forEach(spec => {
        const title = spec.querySelector('.spec__title');
        const description = spec.querySelector('.spec__description');
        const icon = spec.querySelector('.spec__icon i');
        
        if (!title || !description || !icon) return;
        
        if (icon.classList.contains('fa-windows')) {
            title.textContent = technicalTranslations.os.title;
            description.textContent = technicalTranslations.os.description;
        } else if (icon.classList.contains('fa-hdd')) {
            title.textContent = technicalTranslations.disk.title;
            description.textContent = technicalTranslations.disk.description;
        } else if (icon.classList.contains('fa-memory')) {
            title.textContent = technicalTranslations.ram.title;
            description.textContent = technicalTranslations.ram.description;
        } else if (icon.classList.contains('fa-download')) {
            title.textContent = technicalTranslations.installation.title;
            description.textContent = technicalTranslations.installation.description;
        }
    });
}

/**
 * Met à jour la section des témoignages
 */
function updateTestimonialsSection(testimonialsTranslations) {
    const testimonialsTitle = document.querySelector('.testimonials .section-title');
    const intro = document.querySelector('.testimonials__intro');
    
    if (testimonialsTitle) testimonialsTitle.textContent = testimonialsTranslations.title;
    if (intro) intro.textContent = testimonialsTranslations.intro;
    
    // Mise à jour des témoignages individuels
    if (testimonialsTranslations.items) {
        const testimonials = document.querySelectorAll('.testimonial');
        
        testimonials.forEach((testimonial, index) => {
            if (index < testimonialsTranslations.items.length) {
                const item = testimonialsTranslations.items[index];
                const textElement = testimonial.querySelector('.testimonial__text p');
                const authorNameElement = testimonial.querySelector('.testimonial__author-name');
                const authorTitleElement = testimonial.querySelector('.testimonial__author-title');
                
                if (textElement) textElement.textContent = item.text;
                if (authorNameElement) authorNameElement.textContent = item.author;
                if (authorTitleElement) authorTitleElement.textContent = item.job;
            }
        });
    }
}

/**
 * Met à jour la section de téléchargement
 */
function updateDownloadSection(downloadTranslations) {
    const downloadTitle = document.querySelector('#download .section-title');
    const subtitle = document.querySelector('.download__subtitle');
    const button = document.querySelector('.download__cta .button');
    const version = document.querySelector('.download__version');
    
    if (downloadTitle) downloadTitle.textContent = downloadTranslations.title;
    if (subtitle) subtitle.textContent = downloadTranslations.subtitle;
    if (button) button.textContent = downloadTranslations.button;
    if (version) version.textContent = downloadTranslations.version;
}

/**
 * Met à jour la section de contact
 */
function updateContactSection(contactTranslations) {
    const contactTitle = document.querySelector('#contact .section-title');
    const contactText = document.querySelector('.contact__text');
    
    if (contactTitle) contactTitle.textContent = contactTranslations.title;
    if (contactText) contactText.textContent = contactTranslations.text;
    
    // Méthodes de contact
    const methods = document.querySelectorAll('.contact-method');
    methods.forEach(method => {
        const title = method.querySelector('.contact-method__title');
        const value = method.querySelector('.contact-method__value');
        const icon = method.querySelector('.contact-method__icon i');
        
        if (!title || !value || !icon) return;
        
        if (icon.classList.contains('fa-envelope')) {
            title.textContent = contactTranslations.email.title;
            value.textContent = contactTranslations.email.value;
        } else if (icon.classList.contains('fa-phone')) {
            title.textContent = contactTranslations.phone.title;
            value.textContent = contactTranslations.phone.value;
        }
    });
    
    // Formulaire
    const nameLabel = document.querySelector('label[for="name"]');
    const emailLabel = document.querySelector('label[for="email"]');
    const subjectLabel = document.querySelector('label[for="subject"]');
    const messageLabel = document.querySelector('label[for="message"]');
    const submitButton = document.querySelector('.contact__form button[type="submit"]');
    
    if (nameLabel) nameLabel.textContent = contactTranslations.form.name;
    if (emailLabel) emailLabel.textContent = contactTranslations.form.email;
    if (subjectLabel) subjectLabel.textContent = contactTranslations.form.subject;
    if (messageLabel) messageLabel.textContent = contactTranslations.form.message;
    if (submitButton) submitButton.textContent = contactTranslations.form.submit;
    
    // Options du sujet
    const options = document.querySelectorAll('#subject option');
    options.forEach(option => {
        const value = option.value;
        
        if (value === 'question') {
            option.textContent = contactTranslations.form.subject_options.question;
        } else if (value === 'support') {
            option.textContent = contactTranslations.form.subject_options.support;
        } else if (value === 'feedback') {
            option.textContent = contactTranslations.form.subject_options.feedback;
        } else if (value === 'other') {
            option.textContent = contactTranslations.form.subject_options.other;
        }
    });
}

/**
 * Met à jour le pied de page
 */
function updateFooterSection(footerTranslations) {
    const tagline = document.querySelector('.footer__tagline');
    const quickLinks = document.querySelector('.footer__links .footer__title');
    const legal = document.querySelector('.footer__legal .footer__title');
    const social = document.querySelector('.footer__social .footer__title');
    const copyright = document.querySelector('.footer__copyright');
    
    if (tagline) tagline.textContent = footerTranslations.tagline;
    if (quickLinks) quickLinks.textContent = footerTranslations.quick_links;
    if (legal) legal.textContent = footerTranslations.legal;
    if (social) social.textContent = footerTranslations.follow_us;
    if (copyright) copyright.textContent = footerTranslations.copyright;
    
    // Liens du pied de page
    const links = document.querySelectorAll('.footer__list a');
    
    links.forEach(link => {
        const text = link.textContent.trim().toLowerCase();
        
        if (text.includes('confidentialité') || text.includes('privacy')) {
            link.textContent = footerTranslations.links.privacy;
        } else if (text.includes('conditions') || text.includes('terms')) {
            link.textContent = footerTranslations.links.terms;
        } else if (text.includes('licence') || text.includes('license')) {
            link.textContent = footerTranslations.links.license;
        } else if (text.includes('faq')) {
            link.textContent = footerTranslations.links.faq;
        } else if (text.includes('fonctionnalités') || text.includes('features')) {
            link.textContent = translations[currentLanguage].navigation.features;
        } else if (text.includes('applications') || text.includes('apps')) {
            link.textContent = translations[currentLanguage].navigation.apps;
        } else if (text.includes('téléchargement') || text.includes('download')) {
            link.textContent = translations[currentLanguage].navigation.download;
        } else if (text.includes('à venir') || text.includes('coming soon')) {
            link.textContent = translations[currentLanguage].navigation.coming_soon;
        }
    });
}

/**
 * Met à jour la page "À venir"
 */
function updateComingSoonPage(translations) {
    if (!translations) return;
    
    // Mettre à jour le titre de la page
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = translations.title;
    
    // Mettre à jour les liens de navigation (fil d'Ariane)
    const breadcrumbHome = document.querySelector('.breadcrumbs__link[href="../index.html"]');
    const breadcrumbCurrent = document.querySelector('.breadcrumbs__link--active');
    
    if (breadcrumbHome) breadcrumbHome.textContent = translations.breadcrumbs.home;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = translations.breadcrumbs.coming_soon;
    
    // Mettre à jour la section Roadmap
    const roadmapTitle = document.querySelector('.roadmap .section-title');
    const roadmapIntro = document.querySelector('.roadmap__intro');
    
    if (roadmapTitle) roadmapTitle.textContent = translations.roadmap.title;
    if (roadmapIntro) roadmapIntro.textContent = translations.roadmap.intro;
    
    // Mettre à jour les versions
    const timelineItems = document.querySelectorAll('.timeline__item');
    
    if (timelineItems.length > 0 && translations.roadmap.versions) {
        // Version 1.1.0
        const v1_1 = timelineItems[0];
        if (v1_1) {
            const title = v1_1.querySelector('h3');
            const badges = v1_1.querySelector('.timeline__badge');
            const features = v1_1.querySelectorAll('.feature-list__title');
            const descriptions = v1_1.querySelectorAll('.feature-list__description');
            
            if (title) title.textContent = translations.roadmap.versions.v1_1.title;
            if (badges) badges.textContent = translations.roadmap.versions.v1_1.date;
            
            if (features.length === translations.roadmap.versions.v1_1.features.length) {
                features.forEach((feature, index) => {
                    feature.textContent = translations.roadmap.versions.v1_1.features[index].title;
                });
            }
            
            if (descriptions.length === translations.roadmap.versions.v1_1.features.length) {
                descriptions.forEach((desc, index) => {
                    desc.textContent = translations.roadmap.versions.v1_1.features[index].description;
                });
            }
        }
        
        // Version 1.2.0
        const v1_2 = timelineItems[1];
        if (v1_2) {
            const title = v1_2.querySelector('h3');
            const badges = v1_2.querySelector('.timeline__badge');
            const features = v1_2.querySelectorAll('.feature-list__title');
            const descriptions = v1_2.querySelectorAll('.feature-list__description');
            
            if (title) title.textContent = translations.roadmap.versions.v1_2.title;
            if (badges) badges.textContent = translations.roadmap.versions.v1_2.date;
            
            if (features.length === translations.roadmap.versions.v1_2.features.length) {
                features.forEach((feature, index) => {
                    feature.textContent = translations.roadmap.versions.v1_2.features[index].title;
                });
            }
            
            if (descriptions.length === translations.roadmap.versions.v1_2.features.length) {
                descriptions.forEach((desc, index) => {
                    desc.textContent = translations.roadmap.versions.v1_2.features[index].description;
                });
            }
        }
        
        // Version 2.0.0
        const v2_0 = timelineItems[2];
        if (v2_0) {
            const title = v2_0.querySelector('h3');
            const badges = v2_0.querySelector('.timeline__badge');
            const features = v2_0.querySelectorAll('.feature-list__title');
            const descriptions = v2_0.querySelectorAll('.feature-list__description');
            
            if (title) title.textContent = translations.roadmap.versions.v2_0.title;
            if (badges) badges.textContent = translations.roadmap.versions.v2_0.date;
            
            if (features.length === translations.roadmap.versions.v2_0.features.length) {
                features.forEach((feature, index) => {
                    feature.textContent = translations.roadmap.versions.v2_0.features[index].title;
                });
            }
            
            if (descriptions.length === translations.roadmap.versions.v2_0.features.length) {
                descriptions.forEach((desc, index) => {
                    desc.textContent = translations.roadmap.versions.v2_0.features[index].description;
                });
            }
        }
    }
    
    // Mettre à jour la section Applications Futures
    const futureAppsTitle = document.querySelector('.future-apps .section-title');
    const futureAppsIntro = document.querySelector('.future-apps__intro');
    
    if (futureAppsTitle) futureAppsTitle.textContent = translations.future_apps.title;
    if (futureAppsIntro) futureAppsIntro.textContent = translations.future_apps.intro;
    
    // Mettre à jour les cartes d'applications
    const appCards = document.querySelectorAll('.app-card');
    
    if (appCards.length > 0 && translations.future_apps.apps) {
        appCards.forEach((card, index) => {
            if (index < translations.future_apps.apps.length) {
                const title = card.querySelector('.app-card__title');
                const status = card.querySelector('.app-card__status');
                
                if (title) title.textContent = translations.future_apps.apps[index].name;
                if (status) status.textContent = translations.future_apps.apps[index].release;
            }
        });
    }
    
    // Mettre à jour la section de demande de fonctionnalité
    const featureRequestTitle = document.querySelector('.feature-request .section-title');
    const featureRequestIntro = document.querySelector('.feature-request__intro');
    
    if (featureRequestTitle) featureRequestTitle.textContent = translations.feature_request.title;
    if (featureRequestIntro) featureRequestIntro.textContent = translations.feature_request.intro;
    
    // Mettre à jour le formulaire
    const nameLabel = document.querySelector('label[for="name"]');
    const emailLabel = document.querySelector('label[for="email"]');
    const requestTypeLabel = document.querySelector('label[for="requestType"]');
    const appNameLabel = document.querySelector('label[for="appName"]');
    const descriptionLabel = document.querySelector('label[for="description"]');
    const importanceLabel = document.querySelector('label[for="importance"]');
    const submitButton = document.querySelector('.feature-request__form button[type="submit"]');
    
    if (nameLabel) nameLabel.textContent = translations.feature_request.form.name;
    if (emailLabel) emailLabel.textContent = translations.feature_request.form.email;
    if (requestTypeLabel) requestTypeLabel.textContent = translations.feature_request.form.request_type;
    if (appNameLabel) appNameLabel.textContent = translations.feature_request.form.app_name;
    if (descriptionLabel) descriptionLabel.textContent = translations.feature_request.form.description;
    if (importanceLabel) importanceLabel.textContent = translations.feature_request.form.importance;
    if (submitButton) submitButton.textContent = translations.feature_request.form.submit;
    
    // Mettre à jour les options du formulaire
    const requestTypeOptions = document.querySelectorAll('#requestType option');
    
    requestTypeOptions.forEach(option => {
        const value = option.value;
        
        if (value === 'app') {
            option.textContent = translations.feature_request.form.request_types.app;
        } else if (value === 'feature') {
            option.textContent = translations.feature_request.form.request_types.feature;
        } else if (value === 'improvement') {
            option.textContent = translations.feature_request.form.request_types.improvement;
        } else if (value === 'other') {
            option.textContent = translations.feature_request.form.request_types.other;
        }
    });
}

/**
 * Met à jour la page FAQ
 */
function updateFaqPage(translations) {
    if (!translations) return;
    
    // Mettre à jour le titre de la page
    const pageTitle = document.querySelector('.page-title');
    if (pageTitle) pageTitle.textContent = translations.title;
    
    // Mettre à jour les liens de navigation (fil d'Ariane)
    const breadcrumbHome = document.querySelector('.breadcrumbs__link[href="../index.html"]');
    const breadcrumbCurrent = document.querySelector('.breadcrumbs__link--active');
    
    if (breadcrumbHome) breadcrumbHome.textContent = translations.breadcrumbs.home;
    if (breadcrumbCurrent) breadcrumbCurrent.textContent = translations.breadcrumbs.faq;
    
    // Mettre à jour les catégories
    const categoryButtons = document.querySelectorAll('.faq__category-btn');
    
    categoryButtons.forEach(btn => {
        const category = btn.getAttribute('data-category');
        
        if (category === 'general') {
            btn.textContent = translations.categories.general;
        } else if (category === 'technical') {
            btn.textContent = translations.categories.technical;
        } else if (category === 'usage') {
            btn.textContent = translations.categories.usage;
        } else if (category === 'troubleshooting') {
            btn.textContent = translations.categories.troubleshooting;
        }
    });
    
    // Mettre à jour les questions et réponses
    
    // Catégorie Général
    const generalQuestions = document.querySelectorAll('#general .faq__item');
    if (generalQuestions.length > 0 && translations.questions.general) {
        generalQuestions.forEach((item, index) => {
            if (index < translations.questions.general.length) {
                const questionEl = item.querySelector('.faq__question h3');
                const answerEl = item.querySelector('.faq__answer p');
                
                if (questionEl) questionEl.textContent = translations.questions.general[index].question;
                if (answerEl) answerEl.textContent = translations.questions.general[index].answer;
            }
        });
    }
    
    // Catégorie Technique
    const technicalQuestions = document.querySelectorAll('#technical .faq__item');
    if (technicalQuestions.length > 0 && translations.questions.technical) {
        technicalQuestions.forEach((item, index) => {
            if (index < translations.questions.technical.length) {
                const questionEl = item.querySelector('.faq__question h3');
                const answerEl = item.querySelector('.faq__answer p');
                
                if (questionEl) questionEl.textContent = translations.questions.technical[index].question;
                if (answerEl) answerEl.textContent = translations.questions.technical[index].answer;
            }
        });
    }
    
    // Catégorie Utilisation
    const usageQuestions = document.querySelectorAll('#usage .faq__item');
    if (usageQuestions.length > 0 && translations.questions.usage) {
        usageQuestions.forEach((item, index) => {
            if (index < translations.questions.usage.length) {
                const questionEl = item.querySelector('.faq__question h3');
                const answerEl = item.querySelector('.faq__answer p');
                
                if (questionEl) questionEl.textContent = translations.questions.usage[index].question;
                if (answerEl) answerEl.textContent = translations.questions.usage[index].answer;
            }
        });
    }
    
    // Catégorie Dépannage
    const troubleshootingQuestions = document.querySelectorAll('#troubleshooting .faq__item');
    if (troubleshootingQuestions.length > 0 && translations.questions.troubleshooting) {
        troubleshootingQuestions.forEach((item, index) => {
            if (index < translations.questions.troubleshooting.length) {
                const questionEl = item.querySelector('.faq__question h3');
                const answerEl = item.querySelector('.faq__answer p');
                
                if (questionEl) questionEl.textContent = translations.questions.troubleshooting[index].question;
                if (answerEl) answerEl.textContent = translations.questions.troubleshooting[index].answer;
            }
        });
    }
    
    // Mettre à jour le CTA de contact
    const ctaTitle = document.querySelector('.cta h2');
    const ctaSubtitle = document.querySelector('.cta p');
    const ctaButton = document.querySelector('.cta .button');
    
    if (ctaTitle) ctaTitle.textContent = translations.contact_cta.title;
    if (ctaSubtitle) ctaSubtitle.textContent = translations.contact_cta.subtitle;
    if (ctaButton) ctaButton.textContent = translations.contact_cta.button;
} 