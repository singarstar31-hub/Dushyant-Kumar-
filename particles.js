/* =========================================================
   particles.js
   Handles all decorative particle systems:
     - Envelope scene golden dust
     - Hero flower petals
     - Hero gold sparkles
     - Global floating leaves
   Exposes a global WeddingParticles object for the main script.
   ========================================================= */
(function (global) {
    'use strict';

    // Utility: random between min and max
    const rand = (min, max) => Math.random() * (max - min) + min;

    /* ---------- Scene golden dust (envelope screen) ---------- */
    function initSceneParticles(count = 60) {
        const host = document.getElementById('sceneParticles');
        if (!host) return;
        host.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const s = document.createElement('span');
            const size = rand(2, 6);
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            s.style.left = rand(0, 100) + '%';
            s.style.top = rand(0, 100) + '%';
            s.style.opacity = rand(0.3, 0.9);
            s.style.animation = `goldFloat ${rand(9, 22)}s linear ${rand(-15, 0)}s infinite`;
            host.appendChild(s);
        }
    }

    /* ---------- Hero petals ---------- */
    const PETAL_ICONS = ['❀', '✿', '❁', '❋', '✾'];
    function initPetals(count = 22) {
        const host = document.getElementById('petals');
        if (!host) return;
        host.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const p = document.createElement('span');
            p.className = 'petal';
            p.textContent = PETAL_ICONS[Math.floor(Math.random() * PETAL_ICONS.length)];
            p.style.left = rand(0, 100) + '%';
            p.style.top = rand(-20, 100) + '%';
            p.style.fontSize = rand(14, 28) + 'px';
            // Color varies between champagne, rose, gold
            const palette = [
                'rgba(255,200,200,.85)',
                'rgba(255,220,180,.85)',
                'rgba(240,200,120,.9)',
                'rgba(255,240,220,.85)'
            ];
            p.style.color = palette[Math.floor(Math.random() * palette.length)];
            p.style.animationDuration = rand(9, 20) + 's';
            p.style.animationDelay = rand(-20, 0) + 's';
            host.appendChild(p);
        }
    }

    /* ---------- Hero sparkles ---------- */
    function initSparkles(count = 40) {
        const host = document.getElementById('sparkles');
        if (!host) return;
        host.innerHTML = '';
        for (let i = 0; i < count; i++) {
            const s = document.createElement('span');
            s.className = 'sparkle';
            s.style.left = rand(0, 100) + '%';
            s.style.top = rand(0, 100) + '%';
            const size = rand(2, 5);
            s.style.width = size + 'px';
            s.style.height = size + 'px';
            s.style.animationDelay = rand(0, 3) + 's';
            s.style.animationDuration = rand(2, 5) + 's';
            host.appendChild(s);
        }
    }

    /* ---------- Global floating leaves/petals ---------- */
    function initFloatingLeaves(count = 10) {
        const icons = ['🌿', '❀', '✿'];
        for (let i = 0; i < count; i++) {
            const l = document.createElement('span');
            l.className = 'floating-leaf';
            l.textContent = icons[Math.floor(Math.random() * icons.length)];
            l.style.left = rand(0, 100) + '%';
            l.style.top = rand(-30, 80) + '%';
            l.style.fontSize = rand(14, 26) + 'px';
            l.style.animationDuration = rand(14, 26) + 's';
            l.style.animationDelay = rand(-20, 0) + 's';
            l.style.color = Math.random() > 0.5
                ? 'rgba(212,175,55,0.55)'
                : 'rgba(20,80,50,0.5)';
            document.body.appendChild(l);
        }
    }

    /* ---------- Confetti canvas (Thank You section) ---------- */
    function launchConfetti(canvas, duration = 6000) {
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        function resize() {
            canvas.width = canvas.offsetWidth * dpr;
            canvas.height = canvas.offsetHeight * dpr;
            ctx.scale(dpr, dpr);
        }
        resize();
        window.addEventListener('resize', resize);

        const colors = ['#d4af37', '#f2d76c', '#a67c1a', '#f8e7a1', '#5c1a2b', '#f8f4ec'];
        const pieces = [];
        const w = canvas.offsetWidth;
        const h = canvas.offsetHeight;
        for (let i = 0; i < 180; i++) {
            pieces.push({
                x: rand(0, w),
                y: rand(-h, 0),
                r: rand(3, 7),
                d: rand(1, 3),
                color: colors[Math.floor(Math.random() * colors.length)],
                tilt: rand(-10, 10),
                tiltAngleIncrement: rand(0.05, 0.12),
                tiltAngle: 0,
                rot: rand(0, Math.PI * 2)
            });
        }

        let start = performance.now();
        let raf;
        function frame(now) {
            const elapsed = now - start;
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            pieces.forEach(p => {
                p.tiltAngle += p.tiltAngleIncrement;
                p.y += (Math.cos(p.d) + 2 + p.r / 2) * 0.6;
                p.x += Math.sin(p.tiltAngle);
                p.tilt = Math.sin(p.tiltAngle) * 12;
                if (p.y > h) { p.y = -10; p.x = rand(0, w); }
                ctx.save();
                ctx.beginPath();
                ctx.lineWidth = p.r;
                ctx.strokeStyle = p.color;
                ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
                ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r);
                ctx.stroke();
                ctx.restore();
            });
            if (elapsed < duration) {
                raf = requestAnimationFrame(frame);
            } else {
                // fade out gradually
                ctx.fillStyle = 'rgba(0,0,0,0)';
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                cancelAnimationFrame(raf);
            }
        }
        raf = requestAnimationFrame(frame);
    }

    /* ---------- Fireworks (single burst on demand) ---------- */
    function launchFireworks(host) {
        if (!host) host = document.body;
        const colors = ['#d4af37', '#f8e7a1', '#ffb6c1', '#ffd580', '#fff'];
        const bursts = 5;
        for (let b = 0; b < bursts; b++) {
            setTimeout(() => {
                const cx = rand(20, 80);   // vw
                const cy = rand(15, 60);   // vh
                const color = colors[Math.floor(Math.random() * colors.length)];
                for (let i = 0; i < 26; i++) {
                    const p = document.createElement('span');
                    p.style.cssText = `
                        position:fixed;
                        left:${cx}vw;
                        top:${cy}vh;
                        width:6px;height:6px;
                        border-radius:50%;
                        background:${color};
                        box-shadow:0 0 12px ${color};
                        pointer-events:none;
                        z-index:750;
                        --fx:${rand(-160, 160)}px;
                        --fy:${rand(-160, 160)}px;
                        animation: fwBurst 1.4s ease-out forwards;
                    `;
                    host.appendChild(p);
                    setTimeout(() => p.remove(), 1500);
                }
            }, b * 350);
        }
    }

    /* ---------- Public API ---------- */
    global.WeddingParticles = {
        initSceneParticles,
        initPetals,
        initSparkles,
        initFloatingLeaves,
        launchConfetti,
        launchFireworks
    };

})(window);
