(function () {
    const sliders = document.querySelectorAll('.testimonial-slider');
    if (!sliders.length || !window.PD_TESTIMONIALS) return;

    const data = window.PD_TESTIMONIALS;

    sliders.forEach((root) => {
        const track = root.querySelector('.testimonial-track');
        const dotsWrap = root.querySelector('.testimonial-dots');
        const prevBtn = root.querySelector('.testimonial-prev');
        const nextBtn = root.querySelector('.testimonial-next');
        if (!track) return;

        track.innerHTML = '';
        data.forEach((t, i) => {
            const slide = document.createElement('div');
            slide.className = 'testimonial-slide';
            slide.setAttribute('data-index', String(i));
            slide.innerHTML = `
                <blockquote>“${t.quote}”</blockquote>
                <cite>${t.author}<span>${t.role ? ' · ' + t.role : ''}</span></cite>
            `;
            track.appendChild(slide);

            if (dotsWrap) {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'testimonial-dot' + (i === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Testimonial ${i + 1}`);
                dot.addEventListener('click', () => goTo(i));
                dotsWrap.appendChild(dot);
            }
        });

        let current = 0;
        let timer = null;
        const slides = () => track.querySelectorAll('.testimonial-slide');
        const dots = () => root.querySelectorAll('.testimonial-dot');

        const goTo = (i) => {
            const list = slides();
            if (!list.length) return;
            current = ((i % list.length) + list.length) % list.length;
            track.style.transform = `translateX(-${current * 100}%)`;
            dots().forEach((d, idx) => d.classList.toggle('active', idx === current));
        };

        const next = () => goTo(current + 1);
        const prev = () => goTo(current - 1);

        prevBtn?.addEventListener('click', () => { prev(); resetAutoplay(); });
        nextBtn?.addEventListener('click', () => { next(); resetAutoplay(); });

        const resetAutoplay = () => {
            clearInterval(timer);
            timer = setInterval(next, 6000);
        };

        resetAutoplay();
        root.addEventListener('mouseenter', () => clearInterval(timer));
        root.addEventListener('mouseleave', resetAutoplay);
    });
})();
