(function () {
    const modal = document.getElementById('projectDetailModal');
    if (!modal || !window.PD_PROJECTS) return;

    const overlay = modal.querySelector('.pdm-overlay');
    const closeBtn = modal.querySelector('.pdm-close');
    const titleEl = document.getElementById('pdmTitle');
    const statusEl = document.getElementById('pdmStatus');
    const addressEl = document.getElementById('pdmAddress');
    const detailsEl = document.getElementById('pdmDetails');
    const mainImg = document.getElementById('pdmMainImg');
    const thumbsEl = document.getElementById('pdmThumbs');
    const gPrev = modal.querySelector('.pdm-g-prev');
    const gNext = modal.querySelector('.pdm-g-next');
    const imgCounter = document.getElementById('pdmImgCounter');

    const lightbox = document.getElementById('projectLightbox');
    const plImage = document.getElementById('plImage');
    const plOverlay = document.getElementById('plOverlay');
    const plClose = document.getElementById('plClose');
    const plPrev = document.getElementById('plPrev');
    const plNext = document.getElementById('plNext');
    const plCounter = document.getElementById('plCounter');
    const plThumbs = document.getElementById('plThumbs');

    let project = null;
    let imgIndex = 0;
    let lbImages = [];
    let lbIndex = 0;
    let lbOpen = false;

    const openModal = (id) => {
        project = window.PD_PROJECTS[id];
        if (!project) return;
        imgIndex = 0;
        titleEl.textContent = project.title;
        statusEl.textContent = project.status || '';
        statusEl.className = 'pdm-status pdm-status--' + (project.status || '').toLowerCase().replace(/\s+/g, '-');
        const addr = [project.address, project.area].filter(Boolean).join(' · ');
        addressEl.textContent = addr;
        detailsEl.textContent = project.details || '';
        renderGallery();
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.documentElement.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        if (!lbOpen) document.documentElement.style.overflow = '';
    };

    const renderGallery = () => {
        const imgs = project.images || [];
        if (!imgs.length) return;
        mainImg.src = imgs[imgIndex];
        mainImg.alt = project.title;
        imgCounter.textContent = `${imgIndex + 1} / ${imgs.length}`;
        thumbsEl.innerHTML = '';
        imgs.forEach((src, i) => {
            const btn = document.createElement('button');
            btn.type = 'button';
            btn.className = 'pdm-thumb' + (i === imgIndex ? ' active' : '');
            btn.innerHTML = `<img src="${src}" alt="">`;
            btn.addEventListener('click', () => { imgIndex = i; renderGallery(); });
            thumbsEl.appendChild(btn);
        });
    };

    const gPrevImg = () => {
        const n = project.images.length;
        imgIndex = (imgIndex - 1 + n) % n;
        renderGallery();
    };
    const gNextImg = () => {
        const n = project.images.length;
        imgIndex = (imgIndex + 1) % n;
        renderGallery();
    };

    gPrev?.addEventListener('click', gPrevImg);
    gNext?.addEventListener('click', gNextImg);

    const openLightbox = () => {
        if (!lightbox || !plImage) return;
        lbImages = project.images || [];
        lbIndex = imgIndex;
        lbOpen = true;
        lightbox.classList.add('open');
        lightbox.setAttribute('aria-hidden', 'false');
        renderLb();
    };

    const closeLightbox = () => {
        if (!lightbox) return;
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lbOpen = false;
        if (modal.classList.contains('open')) return;
        document.documentElement.style.overflow = '';
    };

    const renderLb = () => {
        plImage.src = lbImages[lbIndex];
        plImage.alt = project.title;
        plCounter.textContent = `${lbIndex + 1} / ${lbImages.length}`;
        if (plThumbs) {
            plThumbs.innerHTML = '';
            lbImages.forEach((src, i) => {
                const li = document.createElement('li');
                li.className = i === lbIndex ? 'active' : '';
                li.innerHTML = `<img src="${src}" alt="">`;
                li.addEventListener('click', () => { lbIndex = i; renderLb(); });
                plThumbs.appendChild(li);
            });
        }
    };

    const lbPrevFn = () => { lbIndex = (lbIndex - 1 + lbImages.length) % lbImages.length; renderLb(); };
    const lbNextFn = () => { lbIndex = (lbIndex + 1) % lbImages.length; renderLb(); };

    mainImg?.addEventListener('click', openLightbox);
    plClose?.addEventListener('click', closeLightbox);
    plOverlay?.addEventListener('click', closeLightbox);
    plPrev?.addEventListener('click', lbPrevFn);
    plNext?.addEventListener('click', lbNextFn);

    const bindHighlight = (item) => {
        item.style.cursor = 'pointer';
        const open = () => {
            const id = item.getAttribute('data-project-id');
            if (id) openModal(id);
        };
        item.addEventListener('click', (e) => {
            e.preventDefault();
            open();
        });
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                open();
            }
        });
    };

    document.querySelectorAll('.gallery-item[data-project-id]').forEach(bindHighlight);

    closeBtn?.addEventListener('click', closeModal);
    overlay?.addEventListener('click', closeModal);

    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('open') && !lbOpen) return;
        if (e.key === 'Escape') {
            if (lbOpen) closeLightbox();
            else closeModal();
        }
        if (modal.classList.contains('open') && !lbOpen) {
            if (e.key === 'ArrowLeft') gPrevImg();
            if (e.key === 'ArrowRight') gNextImg();
        }
        if (lbOpen) {
            if (e.key === 'ArrowLeft') lbPrevFn();
            if (e.key === 'ArrowRight') lbNextFn();
        }
    });

    /* Disable legacy gallery-only lightbox direct open on items with data-project-id */
    document.querySelectorAll('.gallery-item[data-project-id] img').forEach((img) => {
        img.style.pointerEvents = 'none';
    });
})();
