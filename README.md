# Aarav &amp; Ishika — A Royal Wedding Invitation

A cinematic, luxury wedding-invitation website built with **HTML5, CSS3, Vanilla JavaScript, GSAP, ScrollTrigger, Lenis smooth scroll, Font Awesome, and Google Fonts**.

Everything works directly by opening `index.html` — no build step, no framework.

---

## ✨ Highlights

- **Luxury cinematic preloader** with a golden shimmer monogram
- **3D premium envelope** with wax seal, top flap, back layer, front pocket, and a **letter physically hidden inside**
- **Seal-crack animation** → **flap opens** → **letter slides out** → **camera zoom** → **fade into the site**
- **Hero** with glass card, animated names, floating flower petals, golden sparkles, corner floral SVGs
- **Live countdown** to `14 · 02 · 2026` with animated flip numbers
- **Love-story timeline** with parallax images and alternating layout
- **Wedding events**: Haldi, Mehendi, Sangeet, Wedding, Reception
- **Family cards** for parents, grandparents, and special guests
- **Masonry gallery** with fullscreen lightbox (keyboard + swipe)
- **Venue** with Google Maps embed, animated pulse marker, directions button
- **RSVP** form with validation, Google-Sheets-ready endpoint, success overlay + confetti
- **Blessings** & **Thank-you** finale with confetti canvas + fireworks button
- **Music toggle** with smooth fade-in/fade-out, plays only after user interaction
- **Lenis smooth scroll** + **GSAP ScrollTrigger** driving fade / scale / rotate / blur / parallax reveals
- Fully **responsive** — Desktop, Laptop, Tablet, Mobile (portrait + landscape) + print styles

---

## 📁 Project structure

```
Wedding-Invitation/
├── index.html
├── css/
│   ├── style.css
│   ├── responsive.css
│   └── animations.css
├── js/
│   ├── script.js       — orchestrator (preloader, Lenis, GSAP, nav)
│   ├── envelope.js     — cinematic envelope opening sequence
│   ├── countdown.js    — animated live countdown
│   ├── particles.js    — petals, sparkles, dust, confetti, fireworks
│   ├── gallery.js      — masonry + lightbox
│   ├── music.js        — bg music with fade-in / fade-out
│   └── rsvp.js         — form validation + optional Google Sheets
├── assets/
│   ├── images/         — (optional) your own photos
│   ├── music/          — put wedding.mp3 here to use your own track
│   ├── videos/
│   └── icons/
└── README.md
```

---

## 🚀 Getting started

1. **Download / clone** this project.
2. Open `index.html` directly in a modern browser (Chrome, Edge, Safari, Firefox).
3. That's it — the site is fully self-contained.

> Some browsers restrict audio autoplay. Music will begin after the seal-click gesture, and can be toggled with the floating music button.

For the best experience, serve locally:

```bash
# Any static server works, e.g.:
npx serve .
# or
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

---

## 🎨 Customizing

### Names, date, venue
Edit the copy directly in `index.html`. Look for:
- Preloader / envelope letter block (top of file)
- `#hero` section
- `#countdown` — also change target date in `js/countdown.js`
  ```js
  const TARGET_ISO = '2026-02-14T18:30:00+05:30';
  ```
- `#events`, `#family`, `#venue`, `#blessings`, `#thankyou`

### Colors / typography
Design tokens live at the top of `css/style.css`:
```css
:root {
  --gold: #d4af37;
  --wine: #5c1a2b;
  --dark-green: #14322a;
  --f-script: 'Great Vibes', cursive;
  --f-serif: 'Cormorant Garamond', serif;
  --f-sans:  'Poppins', sans-serif;
}
```

### Photos
Replace the Unsplash URLs in `#story` (timeline) and `#gallery`. You can put your own images in `assets/images/` and reference them like:
```html
<figure class="gallery__item" data-full="assets/images/full-01.jpg">
  <img loading="lazy" src="assets/images/thumb-01.jpg" alt="..."/>
</figure>
```

### Background music
Drop your own file at `assets/music/wedding.mp3`. It will be used automatically. A romantic-piano fallback CDN track is included as a second `<source>`.

### RSVP → Google Sheets
1. Create a Google Sheet.
2. Open **Extensions → Apps Script** and paste:
   ```js
   function doPost(e) {
     const data = JSON.parse(e.postData.contents);
     const sh = SpreadsheetApp.getActiveSheet();
     sh.appendRow([data.timestamp, data.name, data.phone,
                   data.guests, data.attend, data.message]);
     return ContentService.createTextOutput(JSON.stringify({ok:true}));
   }
   ```
3. **Deploy → New deployment → Web app**, execute as *Me*, access *Anyone*.
4. Copy the deployment URL into `js/rsvp.js`:
   ```js
   const GS_ENDPOINT = 'https://script.google.com/macros/s/AKfycb.../exec';
   ```

Until an endpoint is set, RSVPs are cached in `localStorage` so nothing is lost during testing.

---

## ⌨️ Keyboard shortcuts

| Key | Action |
|-----|--------|
| `Enter` / `Space` on seal | Open envelope |
| `←` / `→` | Navigate gallery lightbox |
| `Esc` | Close lightbox / mobile menu |
| Swipe (mobile) | Prev/next gallery image |

---

## ♿ Accessibility

- Semantic landmarks (`header`, `main`, `section`, `nav`, `footer`)
- ARIA labels on buttons, aria-hidden on decorative layers
- Full keyboard operability (nav, seal, gallery, RSVP)
- Respects `prefers-reduced-motion`

---

## 🧾 Credits

- Fonts: **Great Vibes**, **Cormorant Garamond**, **Poppins** (Google Fonts)
- Icons: **Font Awesome 6**
- Smooth scroll: **Lenis by Studio Freight**
- Animations: **GSAP + ScrollTrigger**
- Photography: **Unsplash** (placeholder — replace with your own)
- Music fallback: **Pixabay** ("Romantic Piano" — CC0)

---

Made with 💛 for **Aarav &amp; Ishika · 14 February 2026**.
