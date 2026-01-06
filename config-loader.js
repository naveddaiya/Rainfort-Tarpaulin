// Configuration Loader for RainFort Tarpaulin Website
// This script loads config.json and updates the HTML content dynamically

async function loadConfig() {
    try {
        const response = await fetch('./config.json');
        const config = await response.json();

        // Update Site Meta Information
        updateMetaInfo(config.site);

        // Update Logo
        updateLogo(config.logo);

        // Update Navigation
        updateNavigation(config);

        // Update Hero Section
        updateHero(config.hero);

        // Update About Section
        updateAbout(config.about, config.team);

        // Update Products Section
        updateProducts(config.products);

        // Update Features Section
        updateFeatures(config.features);

        // Update Why Choose Us Section
        updateWhyChooseUs(config.whyChooseUs);

        // Update Testimonials
        updateTestimonials(config.testimonials);

        // Update Footer
        updateFooter(config);

        // Update Popup
        updatePopup(config.popup);

        console.log('Configuration loaded successfully!');
    } catch (error) {
        console.error('Error loading configuration:', error);
    }
}

// Update Meta Information
function updateMetaInfo(site) {
    document.title = site.title;
    document.querySelector('meta[name="description"]').setAttribute('content', site.description);
    document.querySelector('meta[name="keywords"]').setAttribute('content', site.keywords);
    document.querySelector('meta[name="theme-color"]').setAttribute('content', site.themeColor);
}

// Update Logo
function updateLogo(logo) {
    const logoImage = document.querySelector('.logo-image');
    if (logoImage) {
        logoImage.src = logo.main;
        logoImage.alt = `${document.querySelector('.logo-text h1').textContent} Logo`;
    }
}

// Update Navigation
function updateNavigation(config) {
    const logoText = document.querySelector('.logo-text h1');
    const logoTagline = document.querySelector('.logo-tagline');
    const navCtaBtn = document.querySelector('.nav-cta-btn');

    if (logoText) logoText.textContent = config.site.name;
    if (logoTagline) logoTagline.textContent = config.site.tagline;

    // Update contact phone in navbar
    if (navCtaBtn) {
        navCtaBtn.href = `tel:${config.contact.phone}`;
        navCtaBtn.querySelector('span').textContent = 'Call Us';
    }

    // Update mobile contact info
    const mobileContactItems = document.querySelectorAll('.mobile-contact-item a');
    if (mobileContactItems.length >= 2) {
        mobileContactItems[0].href = `tel:${config.contact.phone}`;
        mobileContactItems[0].textContent = config.contact.phoneDisplay;
        mobileContactItems[1].href = `mailto:${config.contact.email}`;
        mobileContactItems[1].textContent = config.contact.email;
    }
}

// Update Hero Section
function updateHero(hero) {
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroTitles = document.querySelectorAll('.hero-title .gradient-text');
    const heroDescription = document.querySelector('.hero-description');

    if (heroSubtitle) heroSubtitle.textContent = hero.subtitle;
    if (heroTitles.length >= 2) {
        heroTitles[0].textContent = hero.title[0];
        heroTitles[1].textContent = hero.title[1];
    }
    if (heroDescription) heroDescription.textContent = hero.description;
}

// Update About Section
function updateAbout(about, team) {
    const aboutSubtitle = document.querySelector('.about-content .section-subtitle');
    const aboutTitle = document.querySelector('.about-content .section-title');
    const aboutTexts = document.querySelectorAll('.about-text');
    const experienceNumber = document.querySelector('.experience-number');
    const experienceText = document.querySelector('.experience-text');

    if (aboutSubtitle) aboutSubtitle.textContent = about.sectionSubtitle;
    if (aboutTitle) aboutTitle.innerHTML = about.sectionTitle.replace('RainFort Tarpaulin', '<span class="highlight">RainFort Tarpaulin</span>');

    if (experienceNumber) experienceNumber.textContent = about.experience.years;
    if (experienceText) experienceText.innerHTML = about.experience.text.replace(' ', '<br>');

    // Update about paragraphs with team info
    if (aboutTexts.length >= 3) {
        aboutTexts[0].innerHTML = `<strong>RainFort Tarpaulin</strong> ${about.paragraphs[0].replace('RainFort Tarpaulin', '')}`;
        aboutTexts[1].textContent = about.paragraphs[1];
        aboutTexts[2].innerHTML = about.paragraphs[2]
            .replace('RainFort Tarpaulin', '<strong>RainFort Tarpaulin</strong>')
            .replace(team.marketingExecutive.name, `<strong>${team.marketingExecutive.name}</strong>`);
    }

    // Update stats
    const statItems = document.querySelectorAll('.about-stats .stat-item');
    about.stats.forEach((stat, index) => {
        if (statItems[index]) {
            statItems[index].querySelector('i').className = stat.icon;
            statItems[index].querySelector('h4').textContent = stat.title;
            statItems[index].querySelector('p').textContent = stat.description;
        }
    });
}

// Update Products Section
function updateProducts(products) {
    const productsSubtitle = document.querySelector('.products-intro-text .section-subtitle');
    const productsTitle = document.querySelector('.products-intro-text .section-title');
    const productsDescription = document.querySelector('.products-intro-text p');

    if (productsSubtitle) productsSubtitle.textContent = products.sectionSubtitle;
    if (productsTitle) productsTitle.innerHTML = `${products.sectionTitle.split('Product Range')[0]}<span class="highlight">Product Range</span>`;
    if (productsDescription) productsDescription.textContent = products.description;

    // Update product cards
    const productCards = document.querySelectorAll('.product-card');
    products.items.forEach((product, index) => {
        if (productCards[index]) {
            const img = productCards[index].querySelector('img');
            const title = productCards[index].querySelector('h3');
            const desc = productCards[index].querySelector('p');

            if (img) {
                img.src = product.image;
                img.alt = product.name;
            }
            if (title) title.textContent = product.name;
            if (desc) desc.textContent = product.description;
        }
    });
}

// Update Features Section
function updateFeatures(features) {
    const featuresSubtitle = document.querySelector('.features-header .section-subtitle');
    const featuresTitle = document.querySelector('.features-header .section-title');

    if (featuresSubtitle) featuresSubtitle.textContent = features.sectionSubtitle;
    if (featuresTitle) featuresTitle.innerHTML = `${features.sectionTitle.split('Apart')[0]}<span class="highlight">Apart</span>`;

    // Update feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    features.items.forEach((feature, index) => {
        if (featureCards[index]) {
            featureCards[index].querySelector('.feature-number').textContent = feature.number;
            featureCards[index].querySelector('i').className = feature.icon;
            featureCards[index].querySelector('h3').textContent = feature.title;
            featureCards[index].querySelector('p').textContent = feature.description;
        }
    });
}

// Update Why Choose Us Section
function updateWhyChooseUs(whyChooseUs) {
    const whySubtitle = document.querySelector('.why-choose-header .section-subtitle');
    const whyTitle = document.querySelector('.why-choose-header .section-title');

    if (whySubtitle) whySubtitle.textContent = whyChooseUs.sectionSubtitle;
    if (whyTitle) whyTitle.innerHTML = `${whyChooseUs.sectionTitle.split('Rely On')[0]}<span class="highlight">Rely On</span>`;

    // Update why cards
    const whyCards = document.querySelectorAll('.why-card');
    whyChooseUs.items.forEach((item, index) => {
        if (whyCards[index]) {
            whyCards[index].querySelector('i').className = item.icon;
            whyCards[index].querySelector('h3').textContent = item.title;
            whyCards[index].querySelector('p').textContent = item.description;
        }
    });
}

// Update Testimonials
function updateTestimonials(testimonials) {
    const testimonialsSubtitle = document.querySelector('.testimonials-header .section-subtitle');
    const testimonialsTitle = document.querySelector('.testimonials-header .section-title');

    if (testimonialsSubtitle) testimonialsSubtitle.textContent = testimonials.sectionSubtitle;
    if (testimonialsTitle) testimonialsTitle.innerHTML = `${testimonials.sectionTitle.split('Customers Say')[0]}<span class="highlight">Customers Say?</span>`;

    // Update testimonial cards
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    testimonials.items.forEach((testimonial, index) => {
        if (testimonialCards[index]) {
            testimonialCards[index].querySelector('.testimonial-text').textContent = testimonial.text;
            testimonialCards[index].querySelector('h4').textContent = testimonial.name;
            testimonialCards[index].querySelector('p').textContent = testimonial.role;
        }
    });
}

// Update Footer
function updateFooter(config) {
    const footerLogo = document.querySelector('.footer-logo');
    const footerDescription = document.querySelector('.footer-col p');
    const footerCopyright = document.querySelector('.footer-bottom p');

    if (footerLogo) footerLogo.textContent = config.site.name;
    if (footerDescription) footerDescription.textContent = config.footer.description;
    if (footerCopyright) {
        footerCopyright.innerHTML = `&copy; ${config.footer.copyright} | Designed with <i class="fas fa-heart"></i> by ${config.footer.designedBy}`;
    }

    // Update footer contact
    const footerContactItems = document.querySelectorAll('.footer-contact li');
    if (footerContactItems.length >= 3) {
        footerContactItems[0].innerHTML = `<i class="fas fa-map-marker-alt"></i> ${config.contact.location}`;
        footerContactItems[1].innerHTML = `<i class="fas fa-phone"></i> ${config.contact.phone}`;
        footerContactItems[2].innerHTML = `<i class="fas fa-envelope"></i> ${config.contact.email}`;
    }

    // Update social links
    const socialLinks = document.querySelectorAll('.footer-social a');
    if (socialLinks.length >= 4) {
        socialLinks[0].href = config.social.whatsapp;
        socialLinks[1].href = config.social.facebook;
        socialLinks[2].href = config.social.instagram;
        socialLinks[3].href = config.social.linkedin;
    }
}

// Update Popup
function updatePopup(popup) {
    const popupIcon = document.querySelector('.popup-icon i');
    const popupTitle = document.querySelector('.popup-header h2');
    const popupDescription = document.querySelector('.popup-header p');
    const popupButton = document.querySelector('.popup-submit-btn span');
    const popupSecurity = document.querySelector('.popup-footer span');

    if (popupIcon) popupIcon.className = popup.icon;
    if (popupTitle) popupTitle.textContent = popup.title;
    if (popupDescription) popupDescription.textContent = popup.description;
    if (popupButton) popupButton.textContent = popup.submitButton;
    if (popupSecurity) popupSecurity.textContent = popup.securityNote;

    // Update product options in popup
    const popupSelect = document.querySelector('#popup-product');
    if (popupSelect) {
        popupSelect.innerHTML = popup.productOptions.map(option =>
            `<option value="${option.value}">${option.label}</option>`
        ).join('');
    }

    // Also update contact form select
    const contactSelect = document.querySelector('#contact-product');
    if (contactSelect) {
        contactSelect.innerHTML = popup.productOptions.map(option =>
            `<option value="${option.value}">${option.label}</option>`
        ).join('');
    }
}

// Load configuration when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadConfig);
} else {
    loadConfig();
}
