/* =========================================================
   envelope.js
   Orchestrates the cinematic envelope opening sequence:
     1. Wax seal click → crack animation → break/fall
     2. Flap opens (CSS-driven)
     3. Letter slides out of pocket
     4. Camera-like zoom on the letter
     5. Fade transition into main site
   Exposes WeddingEnvelope.play() and a Promise-based API.
   ========================================================= */
(function (global) {
    'use strict';

    const state = { opened: false };

    function $(sel) { return document.querySelector(sel); }

    function play(onComplete) {
        if (state.opened) return;
        state.opened = true;

        const scene    = $('#envelopeScene');
        const envelope = $('#envelope');
        const seal     = $('#waxSeal');
        const hint     = $('#envelopeHint');
        const sealSnd  = $('#sealSound');

        if (!scene || !envelope || !seal) {
            if (onComplete) onComplete();
            return;
        }

        // 1. Fade the hint
        if (hint) {
            hint.style.transition = 'opacity .4s ease';
            hint.style.opacity = '0';
        }

        // 2. Crack seal
        seal.classList.add('is-breaking');
        try { if (sealSnd) { sealSnd.currentTime = 0; sealSnd.volume = 0.6; sealSnd.play().catch(()=>{}); } } catch (e) {}

        // 3. After a brief crack pause, break seal and open flap
        setTimeout(() => {
            seal.classList.add('is-broken');
        }, 380);

        setTimeout(() => {
            envelope.classList.add('is-open');
        }, 700);

        // 4. Camera zoom on card
        setTimeout(() => {
            envelope.classList.add('is-zooming');
        }, 2400);

        // 5. Fade out envelope scene and reveal main site
        setTimeout(() => {
            scene.classList.add('is-hidden');
            const main = $('#mainSite');
            if (main) {
                main.setAttribute('aria-hidden', 'false');
                main.classList.add('is-revealed');
            }
            document.body.classList.remove('no-scroll');
            if (typeof onComplete === 'function') onComplete();
        }, 3400);
    }

    function bind() {
        const seal = $('#waxSeal');
        if (!seal) return;
        seal.addEventListener('click', () => play());

        // Allow tapping anywhere on the envelope for accessibility
        const env = $('#envelope');
        if (env) env.addEventListener('click', (e) => {
            // If they didn't hit the seal directly, still trigger
            if (e.target === env || e.target.closest('.envelope__letter')) play();
        });

        // Keyboard accessibility
        seal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); }
        });
    }

    global.WeddingEnvelope = { play, bind };

    if (document.readyState !== 'loading') bind();
    else document.addEventListener('DOMContentLoaded', bind);

})(window);
