/* =========================================================
   gallery.js
   Masonry gallery lightbox with:
     - Fullscreen viewer
     - Prev / Next navigation
     - Keyboard support (Esc, ←, →)
     - Body scroll lock while open
     - Lazy-loaded high-res image on demand
   ========================================================= */
(function (global) {
    'use strict';

    const state = { index: 0, items: [] };

    function $(sel, ctx = document) { return ctx.querySelector(sel); }
    function $$(sel, ctx = document) { return Array.from(ctx.querySelectorAll(sel)); }

    function open(index) {
        const lb  = $('#lightbox');
        const img = $('#lightboxImg');
        if (!lb || !img || !state.items.length) return;
        state.index = (index + state.items.length) % state.items.length;
        const src = state.items[state.index];
        img.src = src;
        img.alt = 'Wedding gallery image ' + (state.index + 1);
        lb.classList.add('is-open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.classList.add('no-scroll');
    }

    function close() {
        const lb = $('#lightbox');
        if (!lb) return;
        lb.classList.remove('is-open');
        lb.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('no-scroll');
    }

    function next() { open(state.index + 1); }
    function prev() { open(state.index - 1); }

    function init() {
        const grid = $('#galleryGrid');
        if (!grid) return;
        const figures = $$('.gallery__item', grid);
        state.items = figures.map(f => f.dataset.full || f.querySelector('img')?.src).filter(Boolean);

        figures.forEach((fig, i) => {
            fig.addEventListener('click', () => open(i));
            fig.setAttribute('tabindex', '0');
            fig.addEventListener('keydown', e => {
                if (e.key === 'Enter') open(i);
            });
        });

        $('#lightboxClose')?.addEventListener('click', close);
        $('#lightboxPrev')?.addEventListener('click', prev);
        $('#lightboxNext')?.addEventListener('click', next);
        $('#lightbox')?.addEventListener('click', (e) => {
            if (e.target.id === 'lightbox') close();
        });

        document.addEventListener('keydown', (e) => {
            const lb = $('#lightbox');
            if (!lb || !lb.classList.contains('is-open')) return;
            if (e.key === 'Escape') close();
            else if (e.key === 'ArrowRight') next();
            else if (e.key === 'ArrowLeft') prev();
        });

        // Simple swipe support
        let startX = null;
        const lb = $('#lightbox');
        lb?.addEventListener('touchstart', e => { startX = e.touches[0].clientX; }, { passive: true });
        lb?.addEventListener('touchend', e => {
            if (startX == null) return;
            const dx = e.changedTouches[0].clientX - startX;
            if (Math.abs(dx) > 50) { dx < 0 ? next() : prev(); }
            startX = null;
        }, { passive: true });
    }

    global.WeddingGallery = { init, open, close, next, prev };

    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);

})(window);
