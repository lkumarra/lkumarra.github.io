# Lavendra Kumar Rajput — Portfolio

Personal portfolio for Lavendra Kumar Rajput, Senior SDET at Netomi. Live at **https://lkumarra.github.io/** (also mirrored at https://lavendra.netlify.app/).

## Design
An Apple-inspired, single-page site: system San Francisco type (Inter fallback), generous whitespace,
a frosted-glass navigation bar, bento-style highlight tiles, a segmented control for skills, and soft
scroll-reveal motion. Follows the visitor's light/dark setting and respects reduced-motion preferences.

## Sections
Hero · Stats · Highlights (auto-healing framework, Claude Code, agentic AI + MCP, CI/CD) · Skills ·
Experience · Open-source projects · Education · Contact (Formspree)

## Files
- `index.html` — all content (static, crawlable)
- `styles.css` — design system and layout
- `script.js` — nav, reveal animations, counters, skills tabs, contact form (no dependencies)
- `assets/` — favicon, profile photo and downloadable résumé PDF
- `.nojekyll` — tells GitHub Pages to serve files as-is

## Run locally
```bash
python3 -m http.server 8000   # then open http://localhost:8000
```

## Deploy
Static site, no build step. GitHub Pages serves the `master` branch root: push to `master` and the site
updates within a minute or two (Settings → Pages shows the status).
Contact form submissions go to the Formspree form `xeqrapbe`.
