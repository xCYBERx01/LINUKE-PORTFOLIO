# DESKO — Linux Portfolio OS

Interactive Linux desktop portfolio by **Ahmed Irfan Akrami** — Robotics & AI Engineer, NRL 2025 Community Champion (Team VoltEdge 007, IIT Bombay).

Live: **https://webcv-ahmed.netlify.app** · **https://ahmedcli.netlify.app** — PWA installable · Repo: `DESKO`

![DESKO preview](public/favicon.svg)

## Try it
- Drag / resize windows · **Alt+R** run dialog · **Super/Win+A** Activities
- **Terminal**: `help`, `projects`, `stack`, `open nautilus` · **Nautilus** → `Projects/hardware|software`, `Awards`, `Resume`
- **Firefox** is a portfolio viewer (embed-friendly fallback) · **Dashboard** = Clock, Weather, Crypto, News, Football/Cricket Live
- **Apps**: Paint, Notes (markdown), Calendar (events), Media (Webamp), Settings (wallpapers), Task Manager

## Run
```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # dist/
npm run preview
```

## Deploy
- Netlify: `base '/'` + `_redirects` SPA fallback (already set)
- GitHub Pages: `VITE_GH_PAGES=1 npm run build` → `dist/` → workflow `deploy.yml`

## Tech
React 19 · Vite 8 · Framer Motion · Recharts · Webamp · Axios — `npm run lint` via oxlint

MIT — fork & remix.
