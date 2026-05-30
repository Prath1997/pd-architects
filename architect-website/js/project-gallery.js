/**
 * PD Architects — unified project gallery modal
 * Used by: gallery highlights, completed list, interior list (data-project-id)
 */
(function () {
    const modal = document.getElementById('projectDetailModal');
    if (!modal || !window.PD_PROJECTS) return;

    const overlay = modal.querySelector('.pdm-overlay');
    const dialog = modal.querySelector('.pdm-dialog');
    const closeBtn = modal.querySelector('.pdm-close');
    const titleEl = document.getElementById('pdmTitle');
    const statusEl = document.getElementById('pdmStatus');
    const addressEl = document.getElementById('pdmAddress');
    const detailsEl = document.getElementById('pdmDetails');
    const mainImg = document.getElementById('pdmMainImg');
    const mainWrap = modal.querySelector('.pdm-g-main');
    const thumbsEl = document.getElementById('pdmThumbs');
    const gPrev = modal.querySelector('.pdm-g-prev');
    const gNext = modal.querySelector('.pdm-g-next');
    const imgCounter = document.getElementById('pdmImgCounter');

    const OPEN_DELAY = 220;
    const CLOSE_MS = 480;
    const IMG_TRANSITION = 280;

    let project = null;
    let imgIndex = 0;
    let isOpen = false;
    let isAnimating = false;
    let imgBusy = false;

    const prefersReducedMotion = () =>
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lockScroll = () => { document.documentElement.style.overflow = 'hidden'; };
    const unlockScroll = () => { document.documentElement.style.overflow = ''; };

    const fillMeta = () => {
        titleEl.textContent = project.title;
        statusEl.textContent = project.status || '';
        statusEl.className = 'pdm-status pdm-status--' + (project.status || '').toLowerCase().replace(/\s+/g, '-');
        addressEl.textContent = [project.address, project.area].filter(Boolean).join(' · ');
        detailsEl.textContent = project.details || '';
    };

    const updateCounter = () => {
        const total = (project.images || []).length;
        imgCounter.textContent = total ? `${imgIndex + 1} / ${total}` : '';
    };

    const renderThumbs = () => {
        const imgs = project.images || [];
        thumbsEl.innerHTML = '';
        imgs.forEach((src, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pdm-thumb' + (i === imgIndex ? ' active' : '');
            btn.setAttribute('aria-label', `View image ${i + 1} of ${imgs.length}`);
            btn.innerHTML = `<img src="${src}" alt="">`;
            btn.addEventListener('click', () => goToImage(i));
            thumbsEl.appendChild(btn);
        });
    };

    const setMainImage = (index, animate = true) => {
        const imgs = project.images || [];
        if (!imgs.length || !mainImg) return;

        imgIndex = index;
        const nextSrc = imgs[index];

        const applyImage = () => {
            mainImg.src = nextSrc;
            mainImg.alt = project.title;
            updateCounter();
            renderThumbs();
            imgBusy = false;
        };

        if (!animate || prefersReducedMotion()) {
            applyImage();
            return;
        }

        imgBusy = true;
        mainImg.classList.add('pdm-img-out');
        setTimeout(() => {
            applyImage();
            mainImg.classList.remove('pdm-img-out');
            mainImg.classList.add('pdm-img-in');
            requestAnimationFrame(() => {
                requestAnimationFrame(() => mainImg.classList.remove('pdm-img-in'));
            });
        }, IMG_TRANSITION);
    };

    const goToImage = (index) => {
        if (imgBusy) return;
        const n = (project.images || []).length;
        if (!n) return;
        setMainImage(index, true);
    };

    const gPrevImg = () => {
        const n = (project.images || []).length;
        if (n < 2) return;
        goToImage((imgIndex - 1 + n) % n);
    };

    const gNextImg = () => {
        const n = (project.images || []).length;
        if (n < 2) return;
        goToImage((imgIndex + 1) % n);
    };

    const showModal = () => {
        modal.classList.add('is-visible');
        modal.setAttribute('aria-hidden', 'false');
        lockScroll();
        requestAnimationFrame(() => {
            requestAnimationFrame(() => modal.classList.add('is-open'));
        });
        const onEnd = (e) => {
            if (e.target !== dialog || e.propertyName !== 'transform') return;
            dialog.removeEventListener('transitionend', onEnd);
            isAnimating = false;
            isOpen = true;
        };
        dialog.addEventListener('transitionend', onEnd);
        setTimeout(() => {
            if (!isOpen) {
                isAnimating = false;
                isOpen = true;
            }
        }, CLOSE_MS + 80);
    };

    const open = (id, triggerEl) => {
        if (isAnimating || isOpen) return;
        const data = window.PD_PROJECTS[id];
        if (!data) return;

        project = data;
        imgIndex = 0;
        fillMeta();

        if (triggerEl) {
            triggerEl.classList.add('gallery-trigger-zoom');
            setTimeout(() => triggerEl.classList.remove('gallery-trigger-zoom'), OPEN_DELAY + 120);
        }

        isAnimating = true;

        const delay = prefersReducedMotion() ? 0 : OPEN_DELAY;
        setTimeout(() => {
            setMainImage(0, false);
            showModal();
        }, delay);
    };

    const close = () => {
        if (!isOpen && !modal.classList.contains('is-visible')) return;
        if (isAnimating && !isOpen) return;

        isAnimating = true;
        isOpen = false;
        modal.classList.remove('is-open');
        modal.classList.add('is-closing');

        const finish = () => {
            modal.classList.remove('is-visible', 'is-closing');
            modal.setAttribute('aria-hidden', 'true');
            unlockScroll();
            isAnimating = false;
            mainWrap?.classList.remove('is-zoomed');
        };

        setTimeout(finish, prefersReducedMotion() ? 0 : CLOSE_MS);
    };

    const bindTrigger = (el) => {
        const id = el.getAttribute('data-project-id');
        if (!id || !window.PD_PROJECTS[id]) return;

        el.classList.add('gallery-trigger');
        if (!el.hasAttribute('tabindex') && el.tagName !== 'BUTTON') {
            el.setAttribute('tabindex', '0');
        }
        if (!el.hasAttribute('role') && el.tagName !== 'BUTTON') {
            el.setAttribute('role', 'button');
        }

        const activate = (e) => {
            if (e.type === 'keydown' && e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            open(id, el);
        };

        el.addEventListener('click', activate);
        el.addEventListener('keydown', activate);
    };

    document.querySelectorAll('.gallery-item[data-project-id], .project-list-card[data-project-id]').forEach(bindTrigger);

    document.querySelectorAll('.gallery-item[data-project-id] img').forEach((img) => {
        img.style.pointerEvents = 'none';
    });

    closeBtn?.addEventListener('click', close);
    overlay?.addEventListener('click', close);
    gPrev?.addEventListener('click', gPrevImg);
    gNext?.addEventListener('click', gNextImg);

    mainImg?.addEventListener('click', () => {
        mainWrap?.classList.toggle('is-zoomed');
    });

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('is-visible')) return;
        if (e.key === 'Escape') close();
        if (!isOpen) return;
        if (e.key === 'ArrowLeft') gPrevImg();
        if (e.key === 'ArrowRight') gNextImg();
    });

    window.PDProjectGallery = { open, close };
})();
