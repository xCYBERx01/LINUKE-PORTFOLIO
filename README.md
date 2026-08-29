# AHMED-OS Linux Portfolio

AHMED-OS is a **Linux desktop themed engineering portfolio** built with React 19 + Vite. It presents Ahmed Irfan Akrami's hardware, embedded, robotics, software, and AI projects as a fully functional browser-based operating system.

**Live Demo:** https://xcyberx01.github.io/ahmed-os-linux-portfolio/

---

## ✨ Features

### Core OS
- **Linux Desktop Environment** — 15:10 locked canvas, top panel, taskbar, desktop icons, draggable/resizable/maximizable/minimizable windows with z-index management
- **Boot → Login → Desktop flow** — password hints: `linux` · `mintex` · `password` · `ahmed`
- **Mario Welcome Animation** — interactive intro with growing Mario, coin collection, and crystal ball welcome dialog (shows once per user)
- **Mario easter egg** — `⌘/Ctrl+R` opens Run dialog (Windows-style)
- **Clippy Assistant** — appears after 10s with tips, chat, and like button
- **Patch Notification** — version update banner with install/remind later options

### Window Management
- **Drag & Drop** — titlebar drag, edge/corner resize (8 handles), double-click titlebar to maximize
- **Focus & Z-order** — click any window to focus, taskbar shows active app
- **Minimize/Maximize/Close** — per-window controls, taskbar right-click context menu
- **Right-click Context Menus** — desktop (New Folder, Terminal, Refresh), icons (Open, Rename, Move to Trash), with "Arrange By" submenu
- **Draggable Desktop Icons** — grid-snap, positions persisted to localStorage

### Start Menu / App Launcher
- **Tile Grid Mode** (Windows 10 style) — 8-column grid, pinned section + all apps, drag-to-reorder, right-click pin/unpin/resize/uninstall, live tiles, search filter
- **Classic App Drawer** (@dnd-kit) — paginated (20/page), searchable, reorderable with edge-flip, swipe gestures, keyboard arrows, page dots
- **App Store** — categories (All/Games/Utilities/Productivity/Not Installed), search, install/uninstall with animated notifications
- **Run Dialog** (`⌘/Ctrl+R`) — command palette with suggestions, opens apps/URLs, error handling

### Notifications & System
- **Framer Motion Toasts** — slide-in from right/bottom, auto-dismiss, click to action
- **Patch/Update Banner** — dismissible, remembers version
- **Clippy** — animated SVG, tips/chat/like, remembers dismissed state

---

## 📦 Apps Included

| App | Description |
|-----|-------------|
| **Home / About** | Profile, stats, quick launch |
| **Projects** | Filterable project browser (Software/Hardware/AI/Robotics/Embedded/Automation) with inspector |
| **Resume** | Markdown resume viewer |
| **Terminal** | Command parser (`open <app>`, `ls`, `help`, `clear`, `whoami`, `neofetch`, `date`, `uptime`) |
| **Files** | File manager with sidebar navigation (Home/Documents/Downloads/Pictures) |
| **Notes** | Auto-save notepad with word/char count |
| **Paint** | Canvas drawing with color picker, brush size, clear |
| **Minesweeper** | 3 difficulties, flag mode, win/lose overlays, flag counter |
| **Flappy Bird** | Click/Space to flap, score, game over, restart |
| **Pac-Man** | Arrow/WASD, ghosts (chase/scatter/frightened), power pellets, lives, win |
| **Crossy Road** | Arrow/WASD hop, 15-row grid, car/log lanes, score |
| **Games Folder** | Unified launcher with grid/list view, play buttons, descriptions |
| **Netlify Games** | Iframe-hosted games (Flappy, Pac-Man, Crossy on Netlify) with reload/external/open |
| **Media Player** | Webamp Winamp skin with demo track |
| **Task Manager** | Processes/Performance/Users tabs, End Task, live CPU/memory sparklines |
| **System Monitor** | CPU/memory/swap gauges, OS info |
| **Recycle Bin / Trash** | Restore to original folder, permanent delete |
| **Calendar** | Month view, today highlight, selection, keyboard nav |
| **Browser** | DuckDuckGo/Google/Bing/Yahoo search, back/forward/home/refresh, blocked-site fallback |
| **Internet Explorer** | Full IE-style toolbar, favorites/history/settings sidebars, downloads, progress bar, multiple search engines |
| **Crypto Tracker** | Live BTC/USD via Coinbase, 50-candle chart (Recharts) |
| **News & Weather** | Spaceflight News API, Open-Meteo geolocation, °C/°F toggle |
| **Settings** | 8 wallpapers, 6 accent colors, desktop effects toggles, icon size slider, quick apps |
| **App Store** | Categories, search, install/uninstall, persistent desktop icons |
| **MSN Messenger** | Chat tabs (Chat/Contacts/Settings), Clippy bot, nudge sound, emoji picker, unread badges |
| **Fortune Teller** | Crystal ball animation, daily fortune, category filter, history |
| **Tile Grid** | Windows 10 Start screen clone — pin, resize (S/M/W/L), live tiles, all apps search |

---

## 🛠 Tech Stack

- **React 19** + **Vite 8**
- **React Router** (via manual window manager)
- **Framer Motion** — all animations
- **React Draggable** — desktop icons & windows
- **@dnd-kit** — Start Menu drag-drop reorder
- **Lucide React** — icons
- **Recharts** — crypto charts
- **Webamp** — Winamp player
- **Axios** — API calls
- **Oxlint** — zero-error linting

---

## 🎮 Games (3 Native + 3 Netlify)

| Game | Controls | Features |
|------|----------|----------|
| **Flappy Bird** | Click / Space | Score, game over, restart |
| **Pac-Man** | Arrow / WASD | Ghost AI (chase/scatter/frightened), power pellets, 3 lives, win screen |
| **Crossy Road** | Arrow / WASD | 15 rows, car/log lanes, hop animation, score |

---

## 🚀 Local Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev

# Lint (zero errors)
npm run lint

# Production build
npm run build

# Preview build
npm run preview
```

**Note:** Use `& "C:\Program Files\nodejs\npm.cmd"` on Windows PowerShell instead of `npm`.

---

## 📦 Deployment

Configured for **GitHub Pages** via GitHub Actions. The production site is at:

```
https://xcyberx01.github.io/ahmed-os-linux-portfolio/
```

Vite `base` is set to `/ahmed-os-linux-portfolio/` in `vite.config.js`.

---

## 🔐 Login Passwords

Any of these work: `linux` · `mintex` · `password` · `ahmed`

---

## 🎯 Inspired By

- [wins95Portfolio](https://yuteoctober.github.io/wins95Portfolio/) — Windows 95 React portfolio
- Classic Linux DEs (GNOME 2, KDE 3, XFCE)
- Windows 95/98/XP/10 UI patterns

---

## 📁 Project Structure

```
src/
├── App.jsx                 # Root component, providers, global state
├── main.jsx                # Entry point
├── index.css               # All styles (CSS variables, components)
├── os/
│   ├── AppContext.jsx      # Global context (notifications)
│   ├── App.jsx             # MintexOSInner + providers
│   ├── WindowManager.jsx   # Window rendering, drag/resize/focus
│   ├── Desktop.jsx         # Boot/Login/Shutdown/Desktop/Taskbar/AppDrawer
│   ├── registry.jsx        # App registry (30+ apps)
│   ├── data/               # Projects, contact data
│   ├── components/         # Notification, DraggableIcon, RightClickMenu, AppDrawer, TileGrid, RunDialog, PatchNotification, Clippy, MarioWelcome
│   └── apps/               # All app components (30+)
│       ├── Content.jsx     # About, Resume, Contact, Notepad, Settings, Calendar
│       ├── Files.jsx       # ProjectsWindow, FilesWindow
│       ├── Terminal.jsx
│       ├── Games.jsx       # Minesweeper, Paint
│       ├── Games2.jsx      # FlappyBird, PacMan, CrossyRoad
│       ├── GamesFolder.jsx # Unified games launcher
│       ├── System.jsx      # TaskManager, SysMonitor, RecycleBin
│       ├── Live.jsx        # Crypto, News, Browser
│       ├── Media.jsx       # Webamp
│       ├── MSN.jsx         # Messenger with bot/nudge
│       ├── FortuneTeller.jsx
│       ├── IEBrowser.jsx   # Full IE clone
│       ├── NetlifyGames.jsx
│       └── ...
```

---

## 📄 License

MIT — free to use, modify, and distribute.