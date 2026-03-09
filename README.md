<p align="center">
  <img src="favicon.svg" alt="Gmail Surge" width="80" height="80">
</p>

<h1 align="center">Gmail Surge — Promotional Website</h1>

<p align="center">
  <strong>The landing page for <a href="https://chromewebstore.google.com/detail/nbglbbelbkmiddpcfmmabbfeobemldki?utm_source=item-share-cb">Gmail Surge</a>, a Chrome extension that lets you send personalized bulk emails directly from Gmail.</strong>
</p>

<p align="center">
  <a href="#live-demo">Live Demo</a> &bull;
  <a href="#features">Features</a> &bull;
  <a href="#project-structure">Project Structure</a> &bull;
  <a href="#getting-started">Getting Started</a> &bull;
  <a href="#deployment">Deployment</a> &bull;
  <a href="#customization">Customization</a> &bull;
  <a href="#license">License</a>
</p>

---

## Live Demo

> **GitHub Pages:** `https://<your-username>.github.io/gmail-bulk-sender-website/`

Replace the URL above once the site is deployed.

---

## Overview

This is a fully static, single-page promotional website for the **Gmail Surge** Chrome extension. It's built with zero frameworks and zero build tools — just semantic HTML, vanilla CSS, and a tiny vanilla JS file. The site is designed to be deployed directly to **GitHub Pages** with no configuration.

### What Gmail Surge Does

Gmail Surge is a Manifest V3 Chrome extension that adds bulk-email superpowers to Gmail:

- **CSV Import** — Drag & drop a contact list and auto-detect email + merge fields
- **Rich Text Editor** — Compose emails with formatting, images, and `{{variable}}` personalization
- **Campaign Sending** — Review, test, and launch personalized email campaigns in one click
- **100% Client-Side** — No backend, no data leaves the browser, Chrome OAuth for authentication

---

## Features

### Page Sections

| Section | Description |
|---|---|
| **Navigation** | Sticky top bar with blur-on-scroll, mobile hamburger menu, and "Add to Chrome" CTA |
| **Hero** | Bold headline with animated extension mockup and floating gradient orbs |
| **Social Proof** | Stat counters — 500 daily emails, unlimited templates, 100% private, free to start |
| **How It Works** | 3-step visual wizard: Upload CSV → Compose → Send |
| **Features Grid** | 6 feature cards in a responsive 3×2 grid with inline SVG icons |
| **Privacy & Security** | Split layout with shield illustration and trust-building bullet points |
| **Pricing** | Two-tier comparison (Free vs. Pro) with highlighted "Most Popular" card |
| **FAQ** | 7 accordion-style questions using native `<details>` elements |
| **Final CTA** | Full-width gradient banner with install button |
| **Footer** | Brand, section links, legal pages, Chrome Web Store link, and support email |

### Design & UX

- **Responsive** — Mobile-first with breakpoints at 640px, 768px, and 1024px
- **Animations** — CSS `@keyframes` for the hero entrance; `IntersectionObserver` for fade-in-up reveals on all sections
- **Performance** — No JS frameworks, no bundler; only external dependency is Google Fonts (Inter)
- **Accessibility** — Semantic HTML5, proper heading hierarchy, `focus-visible` states, `prefers-reduced-motion` media query
- **SEO** — Open Graph meta tags, Twitter card, descriptive `<title>`, keyword `<meta>` tags

---

## Project Structure

```
gmail-bulk-sender-website/
├── index.html            # Full landing page (all sections)
├── styles.css            # All styles — responsive, animations, design tokens
├── script.js             # Smooth scroll, IntersectionObserver reveals, mobile nav
├── favicon.svg           # Envelope + lightning bolt SVG favicon
├── stripe-success.html   # Post-payment success page (displays activation code)
├── privacy.html          # Privacy policy page
├── terms.html            # Terms of service page
└── README.md             # You are here
```

### Key Technical Decisions

| Decision | Rationale |
|---|---|
| No build tools | Deploy anywhere instantly — GitHub Pages, Netlify, any static host |
| Vanilla JS (~60 lines) | Scroll-aware nav, mobile toggle, reveal animations, smooth scroll — no framework overhead |
| CSS custom properties | Single source of truth for the color palette (indigo/gold/emerald tokens in `:root`) |
| Inline SVG icons | Zero icon-font or image requests; icons scale perfectly and match the brand palette |
| Native `<details>` for FAQ | Accessible accordion behavior with no JS; styled with CSS |

---

## Getting Started

### Prerequisites

- A web browser (that's it — no Node.js, no package manager)
- Optionally, a local dev server for live reload

### Run Locally

**Option 1 — Open directly:**

```bash
open index.html
# or on Linux:
xdg-open index.html
```

**Option 2 — Local dev server (recommended for proper asset paths):**

```bash
# Python 3
python3 -m http.server 8000

# Node.js (npx, no install needed)
npx serve .

# PHP
php -S localhost:8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## Deployment

### GitHub Pages

1. Push this folder to a GitHub repository
2. Go to **Settings → Pages**
3. Set the source to the branch and folder containing these files
4. (Optional) Add a `.nojekyll` file to the root so GitHub Pages serves raw HTML without Jekyll processing:
   ```bash
   touch .nojekyll
   ```
5. Your site will be live at `https://<username>.github.io/<repo-name>/`

### Netlify / Vercel / Cloudflare Pages

Since this is a plain static site, just point any static host at the folder — no build command needed.

| Setting | Value |
|---|---|
| Build command | *(none)* |
| Publish directory | `.` (root of this folder) |
| Framework preset | None / Static HTML |

---

## Customization

### Brand Colors

All colors are defined as CSS custom properties in `styles.css`:

```css
:root {
  --indigo-950: #1E1B4B;
  --indigo-600: #4F46E5;
  --indigo-500: #6366F1;
  --gold-400:   #FCD34D;
  --gold-500:   #F59E0B;
  --emerald:    #34D399;
  /* ... full palette in styles.css */
}
```

Change any token value and it propagates across the entire site.

### Chrome Web Store Link

Search for `YOUR_EXTENSION_ID` across the HTML files and replace it with the real Chrome Web Store extension ID once published:

```
https://chromewebstore.google.com/detail/nbglbbelbkmiddpcfmmabbfeobemldki?utm_source=item-share-cb
```

### Typography

The site uses [Inter](https://fonts.google.com/specimen/Inter) loaded from Google Fonts with a system-font fallback stack:

```css
font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
```

To swap fonts, update the `<link>` tag in `index.html` and the `font-family` declaration in `styles.css`.

### Adding New Sections

1. Add the HTML section in `index.html` following the existing pattern
2. Add the `.reveal` class to any element that should animate in on scroll
3. Style the section in `styles.css`
4. The `IntersectionObserver` in `script.js` automatically picks up new `.reveal` elements — no JS changes needed

---

## Browser Support

| Browser | Supported |
|---|---|
| Chrome 80+ | Yes |
| Firefox 75+ | Yes |
| Safari 14+ | Yes |
| Edge 80+ | Yes |
| IE 11 | No |

The site uses modern CSS (custom properties, `clamp()`, grid, flexbox) and modern JS (`IntersectionObserver`, arrow functions, `const`/`let`). A graceful fallback is included for browsers without `IntersectionObserver` — all reveal elements become visible immediately.

---

## Performance

The site is designed to be fast out of the box:

- **Zero JS frameworks** — total JS payload is ~60 lines (~1.5 KB unminified)
- **No external images** — all icons are inline SVG
- **Single CSS file** — no unused utility classes, no CSS-in-JS overhead
- **Single external request** — Google Fonts (Inter), loaded with `preconnect` hints
- **Native lazy behavior** — `IntersectionObserver` only triggers animations when elements enter the viewport

---

## Related

| Resource | Link |
|---|---|
| Gmail Surge Extension | [Chrome Web Store](https://chromewebstore.google.com/detail/nbglbbelbkmiddpcfmmabbfeobemldki?utm_source=item-share-cb) |
| Privacy Policy | [`privacy.html`](privacy.html) |
| Terms of Service | [`terms.html`](terms.html) |
| Support | support@gmailsurge.com |

---

## License

Copyright 2025 Gmail Surge. All rights reserved.

This website and its assets are proprietary. Not affiliated with or endorsed by Google LLC.
