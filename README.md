# LINUKE — Linux Portfolio OS

I'm **Ahmed Irfan Akrami** — Robotics & AI Engineer (B.E. Robotics & AI, AITM Bhatkal) and Mechanical Lead of **Team VoltEdge 007** — **NRL 2025 Community Champions** at IIT Bombay. I build across hardware and software: ESP32/C++ embedded, competition robotics, and full-stack web/AI.

**LINUKE** is my Linux desktop-themed portfolio — I rebuilt it as a browser OS so you can explore my work like a real system, not a static page.

**Live:** https://webcv-ahmed.netlify.app & https://ahmedcli.netlify.app — also installable as a PWA (standalone app)
**GitHub:** https://github.com/xCYBERx01/LINUKE-PORTFOLIO
**Contact:** iahmedakrami@gmail.com | linkedin.com/in/ahmedirfanak | Karnataka, India

---

## What I built

I wanted my portfolio to feel like using Linux — windows you drag, a terminal you type in, a file manager you browse, and a companion that feels alive. LINUKE boots into a **GNOME/Yaru Dark** shell (top bar, left dock, `#2d2d2d` / `#1e1e1e` / `#E95420`) and lets you explore **13 shipped projects + 2 bonus builds**:

- **Croc OS v0.5.3** — my ESP32 desk companion on **SH110X 1.3" cyber blue #4fc3f7 128×64**. I ported its **FACEMODE** exactly (pill eyes, slanted brows, glints, `yawn/wonder/hiccup`, `love/trick/angry`, blink `160ms`, sleepy `Zzz`) to replace Clippy — eyes follow your cursor when idle and tilt on click.
- **EdgeBot** — my NRL 2025 competition robot (Team ID 007) — chassis, arm/gripper, torque balancing for repeated-run reliability.
- **LA-NUKES (as Linux)** — this OS itself — React 19 + Vite, draggable/resizable windows, z-index focus, window chrome with GNOME rounding.
- **Meadow, Kharcha, AI Sports Engine, Wildlife Card Game, Drone, Moon Rover, IoT Telemetry & Field Analyzer, ProjectDirec** — plus PC Benchmark & Pet Feeder as bonus.

I also shipped the **electronics and dashboards** behind them: Mosquitto MQTT + InfluxDB + Recharts (robot telemetry) and FastAPI + Pandas + PostgreSQL + Chart.js (field shutter analytics), and the **ProjectDirec** scrapers (Scrapy/BeautifulSoup + Typesense).

---

## How I organized it

- **Nautilus (Files):** I split `Projects` into `hardware` (Embedded/Robotics/Automation — 7) and `software` (Software/AI — 6), and added **Awards** alongside Projects. Resume is **Yute-style**: `ResumeFile | Github | WebResume` (3 objects, `2143 KB`) with my paper **RESUME.PNG** (`public/resume.png` 114KB) rendered inline.
- **Firefox:** I made it a **portfolio viewer** — defaults to `webcv-ahmed.netlify.app`, embed-friendly (`example.com` fallback), Brave search, always-visible `X-Frame-Options` hint and `Open in New Tab`.
- **Terminal:** I wired it to my data — `ls` mirrors Nautilus, `projects` lists 13, `stack` dumps stacks, `open nautilus/firefox/dashboard`, `cat resume` shows my markdown, `whoami` is my bio.
- **Dashboard:** I added **Football Live** (`v3.football.api-sports.io` live + today fallback) and **Cricket Live** (`api.cricapi.com`) with your keys, plus Weather/Crypto/News/Fortune/Clock/System Pulse/GitHub Pulse.

---

## What I fixed and polished

- I made **Paint** fully functional — pen/brush/eraser/fill/line/rect/circle/text/pick, palette + picker, size + fill toggle, **flood fill**, **undo 20 / redo**, **Save PNG**, touch + mouse.
- I revamped **Calendar** — month/week toggle, **add events** (title/time/color), dots on days, week cards, `localStorage`, `Selected: … • n events`.
- I fixed the **glitchy side scrollbars** — thin `8px` overlay, `scrollbar-gutter: stable`, `overflow-y auto + x hidden`.
- I fixed **App Store** — removed Draggable glitch, now proper `installed` Set in `localStorage`, categories filter, `Install/Uninstall` with notifications (Store protected).
- I revamped **Notes** — multi-note sidebar, search, `Bold/Italic/H1/List/Quote/Code` toolbar, **Preview** markdown, word/char count.
- I revamped **Settings** — Appearance (8 wallpapers, 6 accents), Desktop effects (`anim/blur/reduce/Croc` persisted), **Dock icon size live 56–96px**, Reset All.
- I revamped **Media** — Webamp when online with 4-track playlist, **HTML5 fallback** (`Play/Pause/Skip/Volume/Seek`) when offline.
- I removed the **Mario easter egg** — clean FACEMODE only.

---

## My stack

I built LINUKE with **React 19 + Vite 8**, **Framer Motion**, **React Draggable**, **@dnd-kit**, **lucide-react**, **Recharts**, **Webamp**, **Axios**. No `create-react-app` bloat — just `npm run dev` / `build` / `preview`.

---

## Run it yourself

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # → dist/
npm run preview  # http://localhost:4173/
```

On Windows PowerShell use `& "C:\Program Files\nodejs\npm.cmd" run dev`.

---

## Deploy

I host at **webcv-ahmed.netlify.app** (PWA, `manifest.json` + `sw.js` `v2`, `_redirects` for SPA). `vite.config.js` `base:'/'` for Netlify root. For GitHub Pages use `base:'/LINUKE-PORTFOLIO/'`.

---

## My awards

I list them in `resume.md` and `Awards` folder: **NRL Community Champions**, **Aspire Scientist**, **Young Researcher**, **CODEx/Stackathon Finalists**, **TCS IT Quiz State 2×**, **Influenstar / Brand Builder / Changemakers** — plus 13 projects.

If you like it, star **github.com/xCYBERx01/LINUKE-PORTFOLIO** — Croc says thanks ❤️

## License

MIT — I built it to share. Fork it, remix it.
