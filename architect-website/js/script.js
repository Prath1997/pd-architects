// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const header = document.getElementById('header');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });
}

document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger?.classList.remove('active');
        navMenu?.classList.remove('active');
    });
});

// ===== SMOOTH SCROLLING =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
        header?.classList.add('scrolled');
    } else {
        header?.classList.remove('scrolled');
    }
});

// ===== SECTION ANIMATIONS =====
const observerOptions = {
    threshold: 0.12,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            entry.target.style.opacity = '1';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.service-card, .why-card, .gallery-item, .founder-info, .about-content, .contact-block, .svc-highlight-card, .svc-feature-card, .svc-timeline-step, .svc-why-card, .svc-split-card').forEach(element => {
    element.style.opacity = '0';
    observer.observe(element);
});

// ===== COUNTER ANIMATION =====
const counters = document.querySelectorAll('.stat-number');
let countersStarted = false;

const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(counter => {
                if (counter.classList.contains('stat-static')) return;
                const target = parseInt(counter.dataset.target, 10) || 0;
                const showPlus = counter.dataset.plus === 'true';
                const duration = 1600;
                let start = 0;
                const step = Math.max(1, Math.ceil(target / (duration / 16)));

                const update = () => {
                    start += step;
                    if (start < target) {
                        counter.textContent = Math.floor(start) + (showPlus ? '+' : '');
                        requestAnimationFrame(update);
                    } else {
                        counter.textContent = target + (showPlus ? '+' : '');
                    }
                };
                update();
            });
        }
    });
}, { threshold: 0.4 });

const statisticsSection = document.querySelector('.statistics');
if (statisticsSection) {
    counterObserver.observe(statisticsSection);
}

// ===== ACTIVE NAV LINK =====
const navLinks = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
    let currentSection = '';
    document.querySelectorAll('section[id]').forEach(section => {
        const sectionTop = section.offsetTop - 140;
        if (window.pageYOffset >= sectionTop) {
            currentSection = section.getAttribute('id') || currentSection;
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
    });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
const submitButton = contactForm?.querySelector('button[type="submit"]');
const btnText = submitButton?.querySelector('.btn-text');
const btnLoader = submitButton?.querySelector('.btn-loader');

const scriptURL = 'https://script.google.com/macros/s/AKfycbwv9xWAp38WJa19ZfgdrnIyUkUc0p8vNT7iygUnz9BuMdl_aNgLCoVoD66S_YulNvInAw/exec';

const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const setLoading = loading => {
    if (!submitButton || !btnText || !btnLoader) return;
    submitButton.classList.toggle('btn-loading', loading);
    submitButton.disabled = loading;
    btnText.textContent = loading ? 'Sending...' : 'Send Message';
};

const showFeedback = (message, type) => {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.className = `form-feedback ${type}`;
    setTimeout(() => {
        feedback.textContent = '';
        feedback.className = 'form-feedback';
    }, 6000);
};

if (contactForm) {
    const citySearch = document.getElementById('citySearch');
    const cityHidden = document.getElementById('city');
    const cityList = document.getElementById('cityList');
    const mobileInput = document.getElementById('mobile');
    const fullNameInput = document.getElementById('fullName');
    const emailInput = document.getElementById('email');
    const messageInput = document.getElementById('message');

    const cities = [
        'Mumbai', 'Pune', 'Nashik', 'Nagpur', 'Thane', 'Aurangabad', 'Solapur', 'Kolhapur', 'Satara', 'Sangli',
        'Ahmednagar', 'Jalgaon', 'Ratnagiri', 'Latur', 'Nanded', 'Amravati', 'Akola', 'Dhule', 'Beed', 'Raigad',
        'Palghar', 'Sindhudurg', 'Wardha', 'Yavatmal', 'Chandrapur'
    ];

    const initNoAutocompleteField = field => {
        if (!field) return;
        field.readOnly = true;
        field.addEventListener('focus', () => {
            field.readOnly = false;
        });
        field.addEventListener('blur', () => {
            if (!field.value) {
                field.readOnly = true;
            }
        });
    };

    initNoAutocompleteField(fullNameInput);
    initNoAutocompleteField(emailInput);
    initNoAutocompleteField(mobileInput);
    initNoAutocompleteField(citySearch);
    initNoAutocompleteField(messageInput);


    const renderCityList = (filter = '') => {
        if (!cityList) return;
        const normalized = filter.trim().toLowerCase();
        const matches = cities.filter(city => city.toLowerCase().includes(normalized));
        cityList.innerHTML = matches.length
            ? matches.map(city => `<li role="option" tabindex="0">${city}</li>`).join('')
            : '<li class="no-results">No matching city found</li>';
    };

    const closeCityList = () => {
        const container = citySearch?.closest('.custom-select-container');
        container?.classList.remove('open');
    };

    const openCityList = () => {
        const container = citySearch?.closest('.custom-select-container');
        container?.classList.add('open');
    };

    if (mobileInput) {
        mobileInput.addEventListener('input', () => {
            mobileInput.value = mobileInput.value.replace(/\D/g, '').slice(0, 10);
        });
    }

    if (citySearch && cityList && cityHidden) {
        renderCityList();

        citySearch.addEventListener('input', () => {
            renderCityList(citySearch.value);
            cityHidden.value = '';
            openCityList();
        });

        citySearch.addEventListener('focus', () => {
            renderCityList(citySearch.value);
            openCityList();
        });

        cityList.addEventListener('click', event => {
            const target = event.target.closest('li');
            if (!target || target.classList.contains('no-results')) return;
            citySearch.value = target.textContent;
            cityHidden.value = target.textContent;
            closeCityList();
        });

        cityList.addEventListener('keydown', event => {
            const active = document.activeElement;
            if (event.key === 'Enter' && active?.tagName === 'LI') {
                event.preventDefault();
                active.click();
            }
        });

        document.addEventListener('click', event => {
            if (!citySearch.contains(event.target) && !cityList.contains(event.target)) {
                closeCityList();
            }
        });
    }

    contactForm.addEventListener('submit', async event => {
        event.preventDefault();

        const fullName = document.getElementById('fullName')?.value.trim();
        const email = document.getElementById('email')?.value.trim();
        const mobile = document.getElementById('mobile')?.value.trim();
        const city = cityHidden?.value.trim();
        const message = document.getElementById('message')?.value.trim();

        if (!fullName || !email || !mobile || !city || !message) {
            return showFeedback('Please complete all fields before submitting.', 'error');
        }

        if (!isValidEmail(email)) {
            return showFeedback('Please enter a valid email address.', 'error');
        }

        if (!/^\d{10}$/.test(mobile)) {
            return showFeedback('Mobile number must contain exactly 10 digits.', 'error');
        }

        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('Name', fullName);
            formData.append('Email', email);
            formData.append('Mobile', mobile);
            formData.append('City', city);
            formData.append('Message', message);

            await fetch(scriptURL, {
                method: 'POST',
                mode: 'no-cors',
                body: formData
            });

            contactForm.reset();
            cityHidden.value = '';
            showFeedback('Thank you! Your message has been received.', 'success');
        } catch (error) {
            showFeedback('Unable to submit form right now. Please try again shortly.', 'error');
            console.error('Contact form error:', error);
        } finally {
            setLoading(false);
        }
    });
}

window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Homepage hero fallback only (page banners set per-page in HTML/CSS)
document.addEventListener('DOMContentLoaded', () => {
    const hero = document.querySelector('.hero.Homepage-banner');
    if (!hero) return;
    const bg = getComputedStyle(hero).backgroundImage;
    if (!bg || bg === 'none') {
        hero.style.backgroundImage = "url('images/Homepage-banner.png')";
        hero.style.backgroundSize = 'cover';
        hero.style.backgroundPosition = 'center center';
        hero.style.backgroundRepeat = 'no-repeat';
    }
});

/* ===== PROJECTS LIGHTBOX ===== */
(function () {
    const modal = document.getElementById('projectLightbox');
    if (!modal) return;

    const overlay = document.getElementById('plOverlay');
    const closeBtn = document.getElementById('plClose');
    const prevBtn = document.getElementById('plPrev');
    const nextBtn = document.getElementById('plNext');
    const imgEl = document.getElementById('plImage');
    const loader = document.getElementById('plLoader');
    const thumbsEl = document.getElementById('plThumbs');
    const counter = document.getElementById('plCounter');

    const items = Array.from(document.querySelectorAll('.gallery-item:not([data-project-id]) img'));
    let current = 0;
    let openState = false;

    const open = (i) => {
        current = i;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
        render();
        openState = true;
    };
    const close = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.documentElement.style.overflow = '';
        openState = false;
    };

    const showLoader = v => { const wrap = imgEl.closest('.gm-image-wrap'); if (v) wrap.classList.add('loading'); else wrap.classList.remove('loading'); };

    const setImage = (src, alt) => {
        showLoader(true);
        imgEl.style.opacity = '0';
        const tmp = new Image();
        tmp.onload = () => { imgEl.src = src; imgEl.alt = alt || ''; requestAnimationFrame(() => imgEl.style.opacity = '1'); showLoader(false); };
        tmp.src = src;
    };

    const renderThumbs = () => {
        thumbsEl.innerHTML = '';
        items.forEach((it, idx) => {
            const li = document.createElement('li');
            const im = document.createElement('img');
            im.src = it.src;
            im.alt = it.alt || `Thumb ${idx+1}`;
            li.appendChild(im);
            li.addEventListener('click', () => { goTo(idx); });
            if (idx === current) li.classList.add('active');
            thumbsEl.appendChild(li);
        });
    };

    const render = () => {
        const el = items[current];
        const large = el.dataset.large || el.src;
        setImage(large, el.alt);
        counter.textContent = `${current+1} / ${items.length}`;
        renderThumbs();
    };

    const prev = () => { current = (current - 1 + items.length) % items.length; render(); };
    const next = () => { current = (current + 1) % items.length; render(); };
    const goTo = (i) => { current = i; render(); };

    items.forEach((it, i) => {
        it.addEventListener('click', (e) => {
            e.preventDefault();
            open(i);
        });
    });
    closeBtn.addEventListener('click', close);
    overlay.addEventListener('click', close);
    prevBtn.addEventListener('click', prev);
    nextBtn.addEventListener('click', next);

    document.addEventListener('keydown', (e) => {
        if (!openState) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowLeft') prev();
        if (e.key === 'ArrowRight') next();
    });

    imgEl.addEventListener('click', () => { imgEl.classList.toggle('zoomed'); });

    // simple swipe
    let sx = 0; let ex = 0;
    imgEl.addEventListener('touchstart', e => sx = e.changedTouches[0].screenX);
    imgEl.addEventListener('touchend', e => { ex = e.changedTouches[0].screenX; const d = ex - sx; if (Math.abs(d) > 40) { if (d > 0) prev(); else next(); } });

})();


