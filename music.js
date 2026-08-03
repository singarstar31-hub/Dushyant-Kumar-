/* =========================================================
   music.js
   Handles the ambient background music:
     - Play only AFTER user interaction (browser policy)
     - Smooth volume fade in / out
     - Floating toggle button state
     - Auto-tries to start when envelope opens
     - Also fades OUT gracefully on Thank You section (via GSAP hook)
   ========================================================= */
(function (global) {
    'use strict';

    const state = {
        audio: null,
        btn: null,
        playing: false,
        targetVolume: 0.55,
        userInteracted: false
    };

    function $(sel) { return document.querySelector(sel); }

    function fadeTo(target, duration = 1200) {
        if (!state.audio) return;
        const start = state.audio.volume;
        const startTime = performance.now();
        const step = (now) => {
            const t = Math.min(1, (now - startTime) / duration);
            const eased = t * (2 - t); // easeOutQuad
            state.audio.volume = start + (target - start) * eased;
            if (t < 1) requestAnimationFrame(step);
            else if (target === 0) {
                try { state.audio.pause(); } catch (e) {}
            }
        };
        requestAnimationFrame(step);
    }

    function play() {
        if (!state.audio) return;
        state.audio.volume = 0;
        const p = state.audio.play();
        if (p && typeof p.then === 'function') {
            p.then(() => {
                state.playing = true;
                state.btn?.classList.add('is-playing');
                fadeTo(state.targetVolume, 1500);
            }).catch(() => {
                // Autoplay blocked — wait for the user's next click
                state.playing = false;
                state.btn?.classList.remove('is-playing');
            });
        } else {
            state.playing = true;
            state.btn?.classList.add('is-playing');
            fadeTo(state.targetVolume, 1500);
        }
    }

    function pause() {
        if (!state.audio) return;
        state.playing = false;
        state.btn?.classList.remove('is-playing');
        fadeTo(0, 800);
    }

    function toggle() {
        state.userInteracted = true;
        if (state.playing) pause(); else play();
    }

    function fadeOutForFinale(duration = 3500) {
        fadeTo(0, duration);
        state.btn?.classList.remove('is-playing');
        state.playing = false;
    }

    function tryAutoStart() {
        // Called after envelope opens (which is itself a user gesture)
        state.userInteracted = true;
        if (!state.playing) play();
    }

    function init() {
        state.audio = $('#bgMusic');
        state.btn   = $('#musicToggle');
        if (!state.audio || !state.btn) return;

        state.btn.addEventListener('click', toggle);

        // Any interaction unlocks audio context
        const unlock = () => {
            state.userInteracted = true;
            document.removeEventListener('click', unlock);
            document.removeEventListener('touchstart', unlock);
        };
        document.addEventListener('click', unlock);
        document.addEventListener('touchstart', unlock);
    }

    global.WeddingMusic = { init, play, pause, toggle, tryAutoStart, fadeOutForFinale };

    if (document.readyState !== 'loading') init();
    else document.addEventListener('DOMContentLoaded', init);

})(window);
