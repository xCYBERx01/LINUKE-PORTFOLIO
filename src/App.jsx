import { useEffect, useMemo, useRef, useState } from "react";
import { Folder, RefreshCw, Image, TerminalSquare } from "lucide-react";
import WindowManager from "./os/WindowManager";
import { BootScreen, LoginScreen, ShutdownDialog } from "./os/Desktop";
import { appRenderer, appTitle, desktopApps } from "./os/registry";
import { AppProvider, useAppContext } from "./os/AppContext";
import { Notification } from "./os/components/Notification";
import { AppDrawer } from "./os/components/AppDrawer";
import { RunDialog } from "./os/components/RunDialog";
import { PatchNotification } from "./os/components/PatchNotification";
import Croc from "./os/components/Croc";
import TopBar from "./os/components/TopBar";
import Dock from "./os/components/Dock";
import Dashboard from "./os/apps/Dashboard";

const WALLPAPER_KEY = "curio_wallpaper";
const ACCENT_KEY = "curio_accent";

function loadJSON(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v !== null) return JSON.parse(v) ?? fallback;
    // migrate from legacy curio<->mintex keys (one-time)
    const legacy = key.replace("curio_", "mintex_");
    const lv = localStorage.getItem(legacy);
    if (lv !== null) {
      localStorage.setItem(key, lv);
      return JSON.parse(lv) ?? fallback;
    }
    return fallback;
  } catch {
    return fallback;
  }
}

let winCounter = 1;

const appProxy = {};

const stableRegistry = desktopApps().reduce((acc, a) => {
  acc[a.appId] = {
    name: a.label,
    icon: a.icon,
    component: (p) =>
      appRenderer(a.appId, {
        ...p,
        onOpenApp: appProxy.openApp,
        onFocus: appProxy.focusWindow,
        onClose: appProxy.onClose,
        onSetWallpaper: appProxy.setWallpaper,
        onAccent: appProxy.setAccent,
        windows: appProxy.windows,
        activeId: appProxy.activeId,
        wallpaper: appProxy.wallpaper,
        accent: appProxy.accent,
      }),
  };
  return acc;
}, {});

function CurioOSInner() {
  const [now, setNow] = useState(new Date());
  const [wallpaper, setWallpaper] = useState(() => loadJSON(WALLPAPER_KEY, "default"));
  const [accent, setAccent] = useState(() => loadJSON(ACCENT_KEY, "teal"));
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const [booting, setBooting] = useState(() => !sessionStorage.getItem("curio_booted"));
  const [helpOpen, setHelpOpen] = useState(false);

  const MAIN_APPS = desktopApps();

  const [windows, setWindows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const zRef = useRef(10);

  const { addNotification } = useAppContext();

  // Keep proxy in sync without re-render loop — assign synchronously
  appProxy.openApp = openApp;
  appProxy.focusWindow = focusWindow;
  appProxy.setWallpaper = setWallpaper;
  appProxy.setAccent = setAccent;
  appProxy.windows = windows;
  appProxy.activeId = activeId;
  appProxy.wallpaper = wallpaper;
  appProxy.accent = accent;
  appProxy.onClose = closeWindow;

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.wall = wallpaper;
    document.documentElement.dataset.accent = accent;
    localStorage.setItem(WALLPAPER_KEY, JSON.stringify(wallpaper));
    localStorage.setItem(ACCENT_KEY, JSON.stringify(accent));
  }, [wallpaper, accent]);

  useEffect(() => {
    if (booting) {
      const t = setTimeout(() => { setBooting(false); sessionStorage.setItem("curio_booted", "1"); }, 1400);
      return () => clearTimeout(t);
    }
  }, [booting]);

  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        setRunDialogOpen(true);
      }
      if (e.key === "Super" || (e.metaKey && e.key === "a")) {
        e.preventDefault();
        setAppDrawerOpen((v) => !v);
      }
      if (e.key === "?" && !e.ctrlKey && !e.metaKey) {
        // show quick help only when no input focused
        const tag = document.activeElement?.tagName;
        if (tag !== "INPUT" && tag !== "TEXTAREA") setHelpOpen((v) => !v);
      }
      if (e.key === "Escape" && helpOpen) setHelpOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [helpOpen]);

  // Konami code → easter egg
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let pos = 0;
    function onKey(e) {
      if (e.key === seq[pos]) {
        pos++;
        if (pos === seq.length) {
          pos = 0;
          addNotification({ title: "↑↑↓↓←→←→BA — CURIO Unlocked!", message: "Croc is dancing • try ? for shortcuts", duration: 4000 });
          // trigger croc frenzy via storage flag
          localStorage.setItem("curio_konami", String(Date.now()));
          window.dispatchEvent(new Event("curio-konami"));
          // spawn a few windows for fun
          setTimeout(() => openApp("paint"), 200);
        }
      } else pos = e.key === "ArrowUp" ? 1 : 0;
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const lastNotifRef = useRef(0);
  function openApp(appId) {
    if (appId === "dashboard") {
      setDashboardOpen((v) => !v);
      setAppDrawerOpen(false);
      return;
    }
    const meta = MAIN_APPS.find((a) => a.appId === appId);
    let isNew = false;
    setWindows((cur) => {
      const existing = cur.find((w) => w.appId === appId);
      if (existing) {
        setActiveId(existing.id);
        return cur.map((w) =>
          w.id === existing.id ? { ...w, minimized: false, z: ++zRef.current } : w
        );
      }
      isNew = true;
      const extraId = `win-${winCounter++}`;
      const count = cur.length;
      const w = {
        id: extraId,
        appId,
        title: appTitle(appId, meta?.label),
        x: Math.min(140 + (count % 5) * 30, window.innerWidth - 360),
        y: Math.min(50 + (count % 5) * 26, window.innerHeight - 260),
        w: appId === "nautilus" || appId === "firefox" ? 900 : 640,
        h: appId === "nautilus" ? 520 : appId === "firefox" ? 560 : 480,
        minimized: false,
        max: false,
        z: ++zRef.current,
      };
      setActiveId(extraId);
      return [...cur, w];
    });
    setAppDrawerOpen(false);
    // throttle notification: 1.2s debounce and only on new window
    if (isNew) {
      const nowMs = Date.now();
      if (nowMs - lastNotifRef.current > 1200) {
        lastNotifRef.current = nowMs;
        addNotification({
          title: "Application Opened",
          message: meta?.label || appId,
          icon: meta?.icon,
          duration: 1400,
        });
      }
    }
  }

  function focusWindow(clientId) {
    if (typeof clientId === "string" && !clientId.startsWith("win-")) {
      openApp(clientId);
      return;
    }
    const win = windows.find((w) => w.id === clientId);
    if (!win) return;
    setActiveId(win.id);
    setWindows((cur) =>
      cur.map((w) =>
        w.id === win.id ? { ...w, z: ++zRef.current, minimized: false } : w
      )
    );
  }

  function closeWindow(id) {
    setWindows((cur) => {
      const next = cur.filter((w) => w.id !== id);
      if (activeId === id)
        setActiveId(next.length ? next[next.length - 1].id : null);
      return next;
    });
  }

  function minimizeWindow(id) {
    setWindows((cur) => {
      const updated = cur.map((w) =>
        w.id === id ? { ...w, minimized: true } : w
      );
      const visible = updated.filter((w) => !w.minimized);
      setActiveId(visible.length ? visible[visible.length - 1].id : null);
      return updated;
    });
  }

  function toggleMax(id) {
    setWindows((cur) =>
      cur.map((w) => (w.id === id ? { ...w, max: !w.max } : w))
    );
  }

  function updateWindow(id, patch) {
    setWindows((cur) =>
      cur.map((w) => (w.id === id ? { ...w, ...patch } : w))
    );
  }

  // kept for future right-click use
  function _emptyContext() {
    return [
      { label: "Open Terminal", icon: TerminalSquare, action: () => openApp("terminal") },
      { label: "Change Wallpaper", icon: Image, action: () => openApp("settings") },
      { label: "Refresh", icon: RefreshCw, action: () => setNow(new Date()) },
    ];
  }
  void _emptyContext;

  const wallpaperClass = `wall-${wallpaper}`;
  const openAppIds = windows.map((w) => w.appId);
  const activeAppId = windows.find((w) => w.id === activeId)?.appId ?? null;

  return (
    <div className={`os-root ${wallpaperClass}`}>
      {booting && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "grid", placeItems: "center", background: "#05070c", color: "#d9e2ec" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 18 }}>
            <div style={{ width: 44, height: 44, border: "3px solid #222", borderTopColor: "#E95420", borderRadius: "50%", animation: "spin 0.9s linear infinite" }} />
            <div style={{ fontFamily: "var(--font-mono)", fontSize: 13, letterSpacing: 1 }}>CURIO — booting…</div>
            <div style={{ fontSize: 11, color: "#6d7f93" }}>Tip: press ? for shortcuts • Alt+R to run</div>
          </div>
          <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
        </div>
      )}
      {helpOpen && (
        <div onClick={() => setHelpOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 9998, background: "rgba(0,0,0,0.55)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 16 }} >
          <div onClick={(e) => e.stopPropagation()} style={{ width: 460, maxWidth: "92vw", background: "#1e1e1e", border: "1px solid #333", borderRadius: 12, padding: 16, color: "#ddd" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}><strong>CURIO Shortcuts</strong><button onClick={() => setHelpOpen(false)} style={{ background: "transparent", border: 0, color: "#888", cursor: "pointer" }}>✕</button></div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginTop: 12, fontSize: 12, lineHeight: 1.6 }}>
              <div><kbd>Alt</kbd>+<kbd>R</kbd> — Run dialog</div><div><kbd>Super</kbd>+<kbd>A</kbd> — Activities</div>
              <div><kbd>?</kbd> — This help</div><div><kbd>Esc</kbd> — Close overlay</div>
              <div>Drag titlebar — move window</div><div>Double-click titlebar — maximize</div>
              <div>Croc left eye — love</div><div>Croc right eye — trick</div>
              <div>Right-click Croc — yawn/angry</div><div>Konami ↑↑↓↓←→←→BA — surprise</div>
            </div>
            <div style={{ marginTop: 10, fontSize: 11, color: "#888" }}>Windows clamp to screen • Settings → Appearance to change wallpaper</div>
          </div>
        </div>
      )}
      <div
        className="os-desktop gnome-shell"
        onContextMenu={(e) => {
          const isBg =
            e.target === e.currentTarget ||
            (e.target.classList &&
              e.target.classList.contains("os-window-layer"));
          if (isBg) {
            e.preventDefault();
          }
        }}
      >
        <TopBar
          now={now}
          onOpenApp={openApp}
          onShutdown={() => setShutdownOpen(true)}
          onActivities={() => setAppDrawerOpen((v) => !v)}
        />

        <Dock
          openApps={openAppIds}
          activeId={activeAppId}
          onOpen={openApp}
        />

        <div
          className="os-window-layer gnome-window-layer"
          onMouseDown={() => setAppDrawerOpen(false)}
        >
          <WindowManager
            windows={windows}
            activeId={activeId}
            onFocus={focusWindow}
            onClose={closeWindow}
            onMinimize={minimizeWindow}
            onToggleMax={toggleMax}
            registry={stableRegistry}
            onUpdate={updateWindow}
          />
        </div>

        <AppDrawer
          open={appDrawerOpen}
          onClose={() => setAppDrawerOpen(false)}
          onOpen={openApp}
          apps={desktopApps()}
        />

        {dashboardOpen && (
          <Dashboard onClose={() => setDashboardOpen(false)} />
        )}

        {shutdownOpen && (
          <ShutdownDialog
            onShutdown={() => {
              setShutdownOpen(false);
              window.close();
            }}
            onRestart={() => {
              setShutdownOpen(false);
              setWindows([]);
              setActiveId(null);
              window.location.reload();
            }}
            onLogout={() => {
              setShutdownOpen(false);
              setWindows([]);
              setActiveId(null);
              window.location.reload();
            }}
            onCancel={() => setShutdownOpen(false)}
          />
        )}
      </div>

      <RunDialog
        open={runDialogOpen}
        onClose={() => setRunDialogOpen(false)}
        onOpen={openApp}
      />

      <PatchNotification />

      <Croc />

      <Notification />
    </div>
  );
}

export default function CurioOS() {
  return (
    <AppProvider>
      <CurioOSInner />
    </AppProvider>
  );
}
