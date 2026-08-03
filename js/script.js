/* =========================================================
   script.js
   Master orchestrator:
     1. Preloader progress + hide
     2. Lenis smooth scroll + ScrollTrigger integration
     3. Envelope → main-site handoff
     4. GSAP scroll reveals & parallax
     5. Nav shrink + scroll progress bar
     6. Mobile menu toggle
     7. Thank-you fireworks & music fade-out
     8. Confetti & fireworks button
   ========================================================= */
(function () {
    'use strict';

    const $  = (s, c = document) => c.querySelector(s);
    const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));

    let lenis = null;

    /* ---------- 1. PRELOADER ---------- */
    function runPreloader() {
        const bar    = $('.preloader__bar-fill');
        const pct    = $('#loadPercent');
        const preloader = $('#preloader');
        if (!bar || !pct || !preloader) return Promise.resolve();

        // Prevent scroll during preload + envelope
        document.body.classList.add('no-scroll');

        return new Promise((resolve) => {
            let progress = 0;
            const step = () => {
                // Non-linear feel — quick then slow near the end
                const increment = progress < 60 ? 3 + Math.random() * 5
                                 : progress < 90 ? 1 + Math.random() * 2
                                 : 0.5 + Math.random();
                progress = Math.min(100, progress + increment);
                bar.style.width = progress + '%';
                pct.textContent = Math.floor(progress);
                if (progress < 100) {
                    setTimeout(step, 60);
                } else {
                    // Small hold, then fade out
                    setTimeout(() => {
                        preloader.classList.add('is-hidden');
                        // Start scene particles as we cross into envelope
                        if (window.WeddingParticles) {
                            window.WeddingParticles.initSceneParticles(70);
                        }
                        resolve();
                    }, 550);
                }
            };
            step();
        });
    }

    /* ---------- 2. LENIS SMOOTH SCROLL ---------- */
    function initLenis() {
        if (typeof Lenis === 'undefined') return;
        lenis = new Lenis({
            duration: 1.15,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smoothWheel: true,
            smoothTouch: false,
            wheelMultiplier: 1,
            touchMultiplier: 1.4
        });

        function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
        requestAnimationFrame(raf);

        // ScrollTrigger sync
        if (window.ScrollTrigger) {
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((t) => lenis.raf(t * 1000));
            gsap.ticker.lagSmoothing(0);
        }

        // Anchor links go through Lenis
        $$('a[href^="#"]').forEach(a => {
            a.addEventListener('click', (e) => {
                const id = a.getAttribute('href');
                if (id.length > 1) {
                    const target = document.querySelector(id);
                    if (target) {
                        e.preventDefault();
                        lenis.scrollTo(target, { offset: -30, duration: 1.4 });
                        // Also close mobile menu if open
                        const mm = $('#mobileMenu');
                        const toggle = $('#navToggle');
                        if (mm && mm.classList.contains('is-open')) {
                            mm.classList.remove('is-open');
                            toggle?.classList.remove('is-open');
                        }
                    }
                }
            });
        });
    }

    /* ---------- 3. NAV + SCROLL PROGRESS ---------- */
    function initNav() {
        const nav = $('#siteNav');
        const prog = $('#scrollProgress');
        const toggle = $('#navToggle');
        const mobile = $('#mobileMenu');

        function onScroll() {
            const y = window.scrollY;
            if (nav) nav.classList.toggle('is-scrolled', y > 60);
            if (prog) {
                const h = document.documentElement.scrollHeight - window.innerHeight;
                const pct = h > 0 ? (y / h) * 100 : 0;
                prog.style.width = pct + '%';
            }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
        onScroll();

        toggle?.addEventListener('click', () => {
            toggle.classList.toggle('is-open');
            mobile?.classList.toggle('is-open');
            const isOpen = mobile?.classList.contains('is-open');
            mobile?.setAttribute('aria-hidden', String(!isOpen));
        });
    }

    /* ---------- 4. GSAP scroll animations ---------- */
    function initGSAP() {
        if (typeof gsap === 'undefined') { fallbackReveal(); return; }
        if (window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

        // Hero: initial reveal
        gsap.timeline({ defaults: { ease: 'power3.out' } })
            .to('.hero__eyebrow', { opacity: 1, y: 0, duration: 1, delay: 0.1 })
            .to('.hero__names .reveal-word', { opacity: 1, y: 0, duration: 1.1, stagger: 0.15 }, '-=0.6')
            .to('.hero__glass',   { opacity: 1, y: 0, duration: 1 }, '-=0.5')
            .to('.hero__content .btn', { opacity: 1, y: 0, duration: 1 }, '-=0.6');

        // Also mark reveal-word visible for CSS fallback style
        $$('.reveal, .reveal-word').forEach(el => el.classList.add('is-visible'));

        if (!window.ScrollTrigger) return;

        // Section heads
        $$('.section__head').forEach(head => {
            gsap.from(head.children, {
                scrollTrigger: { trigger: head, start: 'top 82%' },
                opacity: 0, y: 40, duration: 1, stagger: 0.12, ease: 'power3.out',
                onStart: () => head.classList.add('is-visible')
            });
        });

        // Countdown cards
        gsap.from('.count-card', {
            scrollTrigger: { trigger: '#countdown', start: 'top 70%' },
            opacity: 0, y: 60, scale: 0.9, duration: 1, stagger: 0.12, ease: 'back.out(1.3)'
        });

        // Timeline items
        $$('.timeline__item').forEach((item, i) => {
            const dir = item.classList.contains('timeline__item--left') ? -80 : 80;
            gsap.from(item, {
                scrollTrigger: { trigger: item, start: 'top 78%' },
                opacity: 0, x: dir, duration: 1, ease: 'power3.out'
            });
            gsap.from(item.querySelector('.timeline__dot'), {
                scrollTrigger: { trigger: item, start: 'top 78%' },
                scale: 0, duration: 0.6, ease: 'back.out(2)', delay: 0.4
            });
        });

        // Parallax on timeline images
        $$('.timeline__img').forEach(img => {
            gsap.to(img, {
                yPercent: -10,
                ease: 'none',
                scrollTrigger: { trigger: img, start: 'top bottom', end: 'bottom top', scrub: true }
            });
        });

        // Events
        gsap.from('.event-card', {
            scrollTrigger: { trigger: '#events', start: 'top 70%' },
            opacity: 0, y: 60, duration: 0.9, stagger: 0.12, ease: 'power3.out'
        });

        // Family
        gsap.from('.family-card', {
            scrollTrigger: { trigger: '#family', start: 'top 70%' },
            opacity: 0, y: 40, duration: 0.8, stagger: 0.1, ease: 'power3.out'
        });

        // Gallery
        gsap.from('.gallery__item', {
            scrollTrigger: { trigger: '#gallery', start: 'top 65%' },
            opacity: 0, y: 50, scale: 0.95, duration: 0.8, stagger: 0.08, ease: 'power3.out'
        });

        // Venue
        gsap.from('.venue__info', {
            scrollTrigger: { trigger: '#venue', start: 'top 70%' },
            opacity: 0, x: -60, duration: 1, ease: 'power3.out'
        });
        gsap.from('.venue__map', {
            scrollTrigger: { trigger: '#venue', start: 'top 70%' },
            opacity: 0, x: 60, duration: 1, ease: 'power3.out'
        });

        // RSVP
        gsap.from('#rsvpForm', {
            scrollTrigger: { trigger: '#rsvp', start: 'top 75%' },
            opacity: 0, y: 60, duration: 1.1, ease: 'power3.out'
        });

        // Blessings quote — letter reveal
        const quoteText = $('.blessings__quote');
        if (quoteText) {
            gsap.from(quoteText, {
                scrollTrigger: { trigger: '#blessings', start: 'top 75%' },
                opacity: 0, y: 40, filter: 'blur(10px)', duration: 1.4, ease: 'power3.out'
            });
        }

        // Thank you
        gsap.from('.thankyou__inner > *', {
            scrollTrigger: { trigger: '#thankyou', start: 'top 70%' },
            opacity: 0, y: 40, duration: 1, stagger: 0.15, ease: 'power3.out'
        });

        // Fire confetti + fade out music when thank-you enters view
        ScrollTrigger.create({
            trigger: '#thankyou',
            start: 'top 65%',
            once: true,
            onEnter: () => {
                const canvas = $('#confettiCanvas');
                if (window.WeddingParticles && canvas) {
                    window.WeddingParticles.launchConfetti(canvas, 8000);
                }
                if (window.WeddingParticles) {
                    window.WeddingParticles.launchFireworks(document.body);
                }
                if (window.WeddingMusic) window.WeddingMusic.fadeOutForFinale();
            }
        });

        // Sparkle parallax
        gsap.to('.hero__sparkles', {
            yPercent: -30, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
        });
        gsap.to('.hero__petals', {
            yPercent: -15, ease: 'none',
            scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true }
        });

        // Section fade for main-site sections
        $$('.section').forEach(sec => {
            gsap.fromTo(sec, { opacity: 0.5 }, {
                opacity: 1,
                scrollTrigger: { trigger: sec, start: 'top 90%', end: 'top 60%', scrub: true }
            });
        });
    }

    // Fallback if GSAP fails to load — use IntersectionObserver reveals
    function fallbackReveal() {
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting) {
                    e.target.classList.add('is-visible');
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15 });
        $$('.reveal, .reveal-word, .section__head, .count-card, .event-card, .family-card, .timeline__item, .gallery__item, .venue__info, .venue__map, #rsvpForm')
            .forEach(el => io.observe(el));
    }

    /* ---------- 5. Fireworks button ---------- */
    function initFireworksBtn() {
        const btn = $('#fireworksBtn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            if (window.WeddingParticles) {
                window.WeddingParticles.launchFireworks(document.body);
            }
        });
    }

    /* ---------- 6. Envelope → Site handoff ---------- */
    function onEnvelopeOpen() {
        // Start music (user interaction has occurred with the seal click)
        if (window.WeddingMusic) window.WeddingMusic.tryAutoStart();

        // Initialize petals, sparkles, floating leaves
        if (window.WeddingParticles) {
            window.WeddingParticles.initPetals(24);
            window.WeddingParticles.initSparkles(50);
            window.WeddingParticles.initFloatingLeaves(8);
        }

        // Init smooth scroll + GSAP after main is visible
        initLenis();
        initGSAP();
        initNav();
        initFireworksBtn();

        // Ensure ScrollTrigger recalculates positions
        if (window.ScrollTrigger) {
            setTimeout(() => ScrollTrigger.refresh(), 300);
        }
    }

    /* ---------- 7. Boot ---------- */
    function boot() {
        // Preloader runs immediately
        runPreloader().then(() => {
            // Envelope scene is now active; wire the open button
            if (window.WeddingEnvelope) {
                // Wrap play() so we can hook onComplete
                const originalPlay = window.WeddingEnvelope.play;
                window.WeddingEnvelope.play = function (cb) {
                    originalPlay(() => {
                        if (cb) cb();
                        onEnvelopeOpen();
                    });
                };
            }
        });
    }

    if (document.readyState !== 'loading') boot();
    else document.addEventListener('DOMContentLoaded', boot);

})();
