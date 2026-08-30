import { useEffect, useMemo, useRef, useState } from "react";
import { Folder, RefreshCw, Image, TerminalSquare } from "lucide-react";
import WindowManager from "./os/WindowManager";
import { ShutdownDialog } from "./os/Desktop";
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

const WALLPAPER_KEY = "mintex_wallpaper";
const ACCENT_KEY = "mintex_accent";

function loadJSON(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
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

function MintexOSInner() {
  const [now, setNow] = useState(new Date());
  const [wallpaper, setWallpaper] = useState(() => loadJSON(WALLPAPER_KEY, "default"));
  const [accent, setAccent] = useState(() => loadJSON(ACCENT_KEY, "teal"));
  const [appDrawerOpen, setAppDrawerOpen] = useState(false);
  const [runDialogOpen, setRunDialogOpen] = useState(false);
  const [shutdownOpen, setShutdownOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);

  const MAIN_APPS = desktopApps();

  const [windows, setWindows] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const zRef = useRef(10);

  const { addNotification } = useAppContext();

  useEffect(() => {
    appProxy.openApp = openApp;
    appProxy.focusWindow = focusWindow;
    appProxy.setWallpaper = setWallpaper;
    appProxy.setAccent = setAccent;
    appProxy.windows = windows;
    appProxy.activeId = activeId;
    appProxy.wallpaper = wallpaper;
    appProxy.accent = accent;
    appProxy.onClose = closeWindow;
  });

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
    function handleKeyDown(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "r") {
        e.preventDefault();
        setRunDialogOpen(true);
      }
      if (e.key === "Super" || (e.metaKey && e.key === "a")) {
        e.preventDefault();
        setAppDrawerOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  function openApp(appId) {
    if (appId === "dashboard") {
      setDashboardOpen((v) => !v);
      setAppDrawerOpen(false);
      return;
    }
    const meta = MAIN_APPS.find((a) => a.appId === appId);
    setWindows((cur) => {
      const existing = cur.find((w) => w.appId === appId);
      if (existing) {
        setActiveId(existing.id);
        return cur.map((w) =>
          w.id === existing.id ? { ...w, minimized: false } : w
        );
      }
      const extraId = `win-${winCounter++}`;
      const count = cur.length;
      const w = {
        id: extraId,
        appId,
        title: appTitle(appId, meta?.label),
        x: 140 + (count % 5) * 30,
        y: 50 + (count % 5) * 26,
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
    addNotification({
      title: "Application Opened",
      message: meta?.label || appId,
      icon: meta?.icon,
      duration: 2000,
    });
  }

  function focusWindow(clientId) {
    const appId =
      typeof clientId === "string" && clientId.startsWith("win-")
        ? null
        : clientId;
    if (appId) {
      openApp(appId);
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

  function emptyContext() {
    return [
      {
        label: "Open Terminal",
        icon: TerminalSquare,
        action: () => openApp("terminal"),
      },
      {
        label: "Change Wallpaper",
        icon: Image,
        action: () => openApp("settings"),
      },
      {
        label: "Refresh",
        icon: RefreshCw,
        action: () => setNow(new Date()),
      },
    ];
  }

  const wallpaperClass = `wall-${wallpaper}`;
  const openAppIds = windows.map((w) => w.appId);
  const activeAppId = windows.find((w) => w.id === activeId)?.appId ?? null;

  return (
    <div className={`os-root ${wallpaperClass}`}>
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

export default function MintexOS() {
  return (
    <AppProvider>
      <MintexOSInner />
    </AppProvider>
  );
}
