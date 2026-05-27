# ⚡ Giancarlo Perrone — Portfolio

> Embedded Systems & IoT Engineer. Building at the intersection of hardware and intelligence.

![PCB Background Preview](https://img.shields.io/badge/theme-PCB%20%2F%20Embedded-00c853?style=flat-square)
![HTML CSS JS](https://img.shields.io/badge/stack-HTML%20%2F%20CSS%20%2F%20JS-00e5ff?style=flat-square)
![No Framework](https://img.shields.io/badge/dependencies-none-39ff14?style=flat-square)

---

## ✨ Features

- **Animated PCB Background** — Canvas-rendered circuit board with moving signal pulses, resistors, capacitors, IC chips, and copper via holes
- **Typewriter Hero** — Rotating subtitle lines with authentic typing/deleting animation
- **Cursor Trail** — Subtle green particle trail that follows your mouse
- **Glitch Logo** — Hover the nav logo for a quick RGB glitch flash
- **Project Cards** — macOS-style cards with image slots, tech tags, and GitHub links
- **Scroll Fade-in** — Elements animate in as you scroll
- **Mobile Responsive** — Hamburger nav, stacked grid on small screens
- **Zero Dependencies** — Pure HTML/CSS/JS, no build step required

---

## 📁 File Structure

```
portfolio/
├── index.html          ← Main HTML (edit content here)
├── css/
│   └── style.css       ← All styling and CSS variables
├── js/
│   ├── pcb.js          ← Canvas PCB animation engine
│   └── main.js         ← Interactions, typewriter, scroll, cursor
├── images/
│   └── .gitkeep        ← Drop your project screenshots here
├── .gitignore
└── README.md
```

---

## 🔧 Customization Guide

### 1. Personal Info

Open `index.html` and find/replace:

| Placeholder | Replace with |
|---|---|
| `your@gmail.com` | Your email address |
| `https://linkedin.com/in/yourprofile` | Your LinkedIn URL |
| `https://github.com/yourusername` | Your GitHub URL |
| `@yourusername` | Your GitHub handle |
| `/in/yourprofile` | Your LinkedIn handle |

Update the **About** section text, terminal block lines, and stats inside `.about-stats`.

### 2. Add a Project Card

Copy any existing `<article class="project-card fi">` block and update:

```html
<article class="project-card fi">
  <div class="card-topbar">
    <span class="mac-dot" style="background:#ff5f57"></span>
    <span class="mac-dot" style="background:#febc2e"></span>
    <span class="mac-dot" style="background:#28c840"></span>
    <span class="card-filename">your-repo-name/</span>
  </div>
  <div class="card-images dual">
    <img class="card-img" src="images/project-screenshot1.png" alt="Screenshot 1">
    <img class="card-img" src="images/project-screenshot2.png" alt="Screenshot 2">
  </div>
  <div class="card-body">
    <h3 class="card-name">Your Project Name</h3>
    <p class="card-desc">A short description of what this project does and why it matters.</p>
    <div class="card-tags">
      <span class="ctag">Tech 1</span>
      <span class="ctag">Tech 2</span>
    </div>
  </div>
  <div class="card-footer">
    <span class="card-status on">● In Progress</span>
    <!-- or: <span class="card-status done">✓ Complete</span> -->
    <a href="https://github.com/yourusername/repo" target="_blank" class="repo-link">
      <!-- github svg --> View Repo
    </a>
  </div>
</article>
```

### 3. Add Project Images

Drop screenshots into the `images/` folder:

```html
<!-- Single image -->
<div class="card-images single">
  <img class="card-img" src="images/myproject.png" alt="Project Name">
</div>

<!-- Two images side-by-side -->
<div class="card-images dual">
  <img class="card-img" src="images/myproject-1.png" alt="Screenshot 1">
  <img class="card-img" src="images/myproject-2.png" alt="Screenshot 2">
</div>
```

### 4. Change PCB Density

Open `js/pcb.js` and tweak `CFG` at the top:

```js
GRID:       52,    // ↑ bigger = more spaced out, ↓ smaller = denser
PROB_H:     0.36,  // probability a horizontal trace is drawn (0–1)
PROB_V:     0.36,  // probability a vertical trace is drawn (0–1)
SIGNAL_COUNT: 50,  // number of animated signal pulses
SPD_MIN:    70,    // slowest pulse (px/s)
SPD_MAX:    175,   // fastest pulse (px/s)
TRAIL_PX:   65,    // how long the glowing tail is
```

### 5. Color Scheme

All colors are CSS variables in `css/style.css`:

```css
:root {
  --trace:        #00c853;  /* PCB trace green      */
  --trace-bright: #39ff14;  /* neon green highlights */
  --signal:       #00ffcc;  /* signal pulse color    */
  --accent:       #00e5ff;  /* cyan accent           */
  --bg:           #030b06;  /* background            */
}
```

Want a blue cyberpunk theme? Swap `--trace` to `#0080ff`, `--trace-bright` to `#00aaff`, `--signal` to `#00ffff`.

---

## 🚀 Hosting Options

### ① GitHub Pages — Free, 0 config (Recommended)

```bash
# Push your repo first (see Git Setup below)
# Then in GitHub.com:
# Settings → Pages → Source: main branch / root → Save
# Your site: https://yourusername.github.io/portfolio
```

### ② Netlify — Free tier, instant deploys, custom domain

1. [netlify.com](https://netlify.com) → **Add new site → Import from Git**
2. Connect your GitHub repo
3. Build command: *(leave empty)*
4. Publish directory: `.`
5. Click **Deploy site**

Auto-deploys on every `git push`. Free custom domain support.

### ③ Vercel — Free tier, fast global CDN

```bash
npm i -g vercel
vercel --prod
# Follows prompts, deploys in ~10s
```

Or connect via [vercel.com](https://vercel.com) → **New Project → Import from GitHub**.

### ④ Cloudflare Pages — Free, best global performance

1. [pages.cloudflare.com](https://pages.cloudflare.com) → **Create application → Pages**
2. Connect GitHub repo
3. Framework preset: **None**
4. Build command: *(leave empty)*
5. Deploy

---

## 🛠️ Git Setup

```bash
# In the portfolio/ folder:
git init
git add .
git commit -m "feat: initial portfolio launch"

# Create repo on GitHub (requires GitHub CLI):
gh repo create portfolio --public --push --source .

# Or manually add remote:
git remote add origin https://github.com/yourusername/portfolio.git
git branch -M main
git push -u origin main
```

After any edits:

```bash
git add . && git commit -m "update: add new project" && git push
```

---

## 🧩 Ideas to Add Later

- **Dark/light mode toggle** — swap CSS variables via JS
- **Resume PDF button** — link to a hosted PDF in `assets/`
- **Blog section** — static markdown rendered via a tiny parser
- **Stats widget** — GitHub contribution graph via API
- **Contact form** — integrate Formspree or Netlify Forms (no backend)
- **Project detail pages** — `projects/aqi-lstm.html` with full write-up
- **Favicon** — add a PCB trace SVG favicon in the `<head>`

---

*Built with solder fumes and late-night commits.*
