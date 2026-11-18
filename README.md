<<<<<<< HEAD
# ⚡ Giancarlo Passanante — Engineering & ML Portfolio
=======
# ⚡ Giancarlo Passanante — Portfolio
>>>>>>> ead14b98c337ac34d87cd52ec9a1bb3e809ad07f

> Embedded Systems, Autonomous Robotics & Quantitative ML Engineer. Marquette University (B.S. CompE, May 2026).

![Theme Modern Obsidian](https://img.shields.io/badge/theme-Neural%20Cyber--Glass-00f0ff?style=flat-square)
![Stack HTML CSS JS](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-8b5cf6?style=flat-square)
![Zero Dependencies](https://img.shields.io/badge/dependencies-none-10b981?style=flat-square)

---

## ✨ Key Features & Architecture

- **Interactive Dynamic Neural Constellation Background** — Canvas-rendered floating particle mesh with distance-reactive lines and magnetic cursor interaction (repulsion, gentle gravitation, and smooth 60fps rendering). Pauses automatically when tab is inactive.
- **Spotlight Mega-Card: Autonomous Weather UAV** — Full-width spotlight card featuring an interactive 4-view gallery switcher (Avionics CAD, Sensor Payload Pod, Flight Telemetry Log, Bench Rig), specs matrix, and full-screen lightbox modal.
- **Featured Card: Weather Derivatives Machine Learning Modeling** — High-impact quantitative modeling card with CME Group Heating Degree Days (HDD) forecast visualizer, 95% Monte Carlo confidence intervals, and risk mitigation specs.
- **Modern Vibrant Typography** — Google Fonts `Space Grotesk` (display headings), `Inter` (readable UI & descriptions), and `JetBrains Mono` (terminals, metrics, and tags).
- **Glassmorphism & Luminous Ambient Atmosphere** — Deep obsidian canvas with floating radial aurora glows (cyan `#00f0ff`, electric violet `#8b5cf6`, vibrant emerald `#10b981`), refined glass borders, and no dated CRT scanlines.
- **Interactive Lightbox Modal** — Click any project schematic, architecture diagram, or screenshot to view in full-screen high resolution.
- **Interactive Terminal & One-Click Copy** — Styled terminal with quick copy-to-clipboard button and visual toast notifications.
- **Responsive Architecture** — Seamless mobile navigation, flexible grid layouts, and zero external framework dependencies.

---

## 📁 Repository Structure

```
portfolio/
├── index.html                           ← Main portfolio (all-in-one HTML, CSS & JS)
├── images/
│   ├── uav-avionics-arch.svg            ← Vector CAD: Weather UAV Avionics Architecture
│   ├── uav-sensor-payload.svg           ← Vector CAD: Sensor Payload Bay & Laminar Flow Duct
│   ├── uav-telemetry.svg                ← Vector CAD: 915 MHz Telemetry & Sounding Skew-T Plot
│   ├── weather-derivatives-ml.svg       ← Vector CAD: Quant ML HDD Forecast & CME Pricing
│   ├── EDGE_CASE.png                    ← PRISM Edge AQI 3D Enclosure
│   ├── EDGE_PCB.png                     ← PRISM Edge AQI Custom PCB
│   ├── Context_Monitor.jpg              ← Activity Context Monitor Hardware
│   ├── BLOCKDIAGRAM_CONTEXT.png         ← Activity Monitor Block Diagram
│   ├── SETUP_GIMBAL.png                 ← Autonomous Pan-Tilt Gimbal Setup
│   └── WORKFLOW_GIMBAL .png             ← Pan-Tilt Gimbal Tracking Workflow
├── README.md                            ← Documentation & customization guide
└── index.html.bak                       ← Backup of original file
```

---

## 🔧 How to Customize

### 1. Adding Real Photos to the Weather UAV Project
The Weather UAV project card features an interactive 4-view gallery switcher in [index.html](file:///C:/Users/Giancarlo/Documents/Github/portfolio26.io/index.html).

To replace any vector schematic with real photos:
1. Save your photo into `images/` (e.g. `images/uav-photo1.jpg`).
2. Open `index.html` and locate the thumbnail buttons inside `.gallery-thumbs-bar` (around line 690):
```html
<button class="gallery-thumb-btn" data-img="images/uav-photo1.jpg" data-caption="Fig 4: Field Flight Testing & Avionics Assembly">
  <span class="thumb-label">4. Flight Photos</span>
  <span class="thumb-sub">Field Test Assembly</span>
</button>
```

### 2. Updating Repository & Contact Links
All links are pre-configured to your handles:
- **Email**: `gcpassan@gmail.com`
- **LinkedIn**: `https://www.linkedin.com/in/giancarlo-passanante-a46a95283/`
- **GitHub**: `https://github.com/LeadingGecko`
- **Goodreads**: `https://www.goodreads.com/user/show/145210950-giancarlo-passanante`

When you create new public repositories for the Weather UAV or Weather Derivatives projects, update the `href` on `.spotlight-link-btn` inside the respective project card.

---

## 🚀 Publishing / Deployment

The site is 100% static with zero dependencies, ready to deploy instantly:

- **GitHub Pages**: Push to `main` branch &rarr; GitHub Repository Settings &rarr; Pages &rarr; Source: `main` branch `/ (root)` &rarr; Save.
- **Vercel / Netlify / Cloudflare Pages**: Connect repository and deploy with 0 build steps.
