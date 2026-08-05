/* =========================================================
   countdown.js
   Live wedding-day countdown with animated flip numbers.
   Target date: 14 Feb 2026, 18:30 IST.
   ========================================================= */
(function (global) {
    'use strict';

    // Change target date here if needed
    const TARGET_ISO = '2027-02-14T18:30:00+05:30';
    const targetTime = new Date(TARGET_ISO).getTime();

    const pad = n => String(n).padStart(2, '0');

    function flip(el, newVal) {
        if (!el) return;
        if (el.textContent === newVal) return;
        el.classList.remove('is-flip');
        // Force reflow to restart animation
        void el.offsetWidth;
        el.classList.add('is-flip');
        // Change text mid-flip
        setTimeout(() => { el.textContent = newVal; }, 250);
    }

    function tick() {
        const now = Date.now();
        let diff = Math.max(0, targetTime - now);

        const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
        diff -= days * 1000 * 60 * 60 * 24;
        const hours   = Math.floor(diff / (1000 * 60 * 60));
        diff -= hours * 1000 * 60 * 60;
        const minutes = Math.floor(diff / (1000 * 60));
        diff -= minutes * 1000 * 60;
        const seconds = Math.floor(diff / 1000);

        const grid = document.getElementById('countdownGrid');
        if (!grid) return;
        const dayEl = grid.querySelector('[data-unit="days"]');
        const hourEl = grid.querySelector('[data-unit="hours"]');
        const minEl  = grid.querySelector('[data-unit="minutes"]');
        const secEl  = grid.querySelector('[data-unit="seconds"]');

        flip(dayEl,  pad(days));
        flip(hourEl, pad(hours));
        flip(minEl,  pad(minutes));
        flip(secEl,  pad(seconds));
    }

    function start() {
        tick();
        setInterval(tick, 1000);
    }

    global.WeddingCountdown = { start };

    if (document.readyState !== 'loading') start();
    else document.addEventListener('DOMContentLoaded', start);

})(window);
