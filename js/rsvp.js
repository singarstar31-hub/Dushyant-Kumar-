/* =========================================================
   rsvp.js
   RSVP form:
     - Client-side validation
     - Optional Google Sheets integration via a Web-App URL
       (set GS_ENDPOINT below). If left empty, the response is
       stored in localStorage and shown to the user.
     - Success overlay with confetti burst
   ========================================================= */
(function (global) {
    'use strict';

    // Paste your Google Apps Script Web App URL here:
    //  1. Create a Google Sheet
    //  2. Extensions → Apps Script → paste a doPost that appends the row.
    //  3. Deploy → New deployment → Web app → "Anyone" → copy URL.
    const GS_ENDPOINT = ''; // e.g. 'https://script.google.com/macros/s/AKfycb.../exec'

    function $(sel) { return document.querySelector(sel); }

    function showError(input) {
        input.classList.add('is-error');
        input.addEventListener('input', () => input.classList.remove('is-error'), { once: true });
    }

    function validate(form) {
        let ok = true;
        const required = ['name', 'phone', 'attend'];
        required.forEach(name => {
            const field = form.elements[name];
            if (!field) return;
            const val = (field.value || '').trim();
            if (!val) { showError(field); ok = false; }
        });
        // phone: at least 6 digits
        const phone = form.elements['phone'];
        if (phone && phone.value.replace(/\D/g, '').length < 6) {
            showError(phone); ok = false;
        }
        return ok;
    }

    function serialize(form) {
        const data = {};
        Array.from(new FormData(form).entries()).forEach(([k, v]) => data[k] = v);
        data.timestamp = new Date().toISOString();
        return data;
    }

    function showSuccess() {
        const overlay = $('#rsvpSuccess');
        if (!overlay) return;
        overlay.classList.add('is-open');
        overlay.setAttribute('aria-hidden', 'false');

        // Confetti burst using particles helper
        if (global.WeddingParticles && global.WeddingParticles.launchFireworks) {
            global.WeddingParticles.launchFireworks(document.body);
        }
    }

    function hideSuccess() {
        const overlay = $('#rsvpSuccess');
        if (!overlay) return;
        overlay.classList.remove('is-open');
        overlay.setAttribute('aria-hidden', 'true');
    }

    function submit(form) {
        const data = serialize(form);

        // Local cache — helps testing, gives couple a fallback
        try {
            const key = 'wedding_rsvp_' + Date.now();
            localStorage.setItem(key, JSON.stringify(data));
        } catch (e) {}

        // Optional Google Sheets webhook
        if (GS_ENDPOINT) {
            fetch(GS_ENDPOINT, {
                method: 'POST',
                mode: 'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            }).catch(() => { /* silent */ });
        }

        showSuccess();
        form.reset();
    }

    function init() {
        const form = $('#rsvpForm');
        if (!form) return;

        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!validate(form)) return;
            const btn = form.querySelector('button[type="submit"]');
            if (btn) {
                const original = btn.innerHTML;
                btn.disabled = true;
                btn.innerHTML = '<i class="fa-solid fa-heart"></i><span>Sending…</span>';
                setTimeout(() => {
                    submit(form);
                    btn.disabled = false;
                    btn.innerHTML = original;
                }, 700);
            } else {
                submit(form);
            }
        });

        $('#rsvpSuccessClose')?.addEventListener('click', hideSuccess);
        $('#rsvpSuccess')?.addEventListener('click', (e) => {
            if (e.target.id === 'rsvpSuccess') hideSuccess();
        });
    }

    global.WeddingRSVP = { init };

    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);

})(window);
