import { useState, useEffect, useContext, useMemo } from "react";
import { Search, X, ChevronDown, ChevronUp, Download, Trash2, Check } from "lucide-react";
import AppContext from "../AppContext";
import { desktopApps } from "../registry";

const CATEGORIES = [
  { id: "all", label: "All Apps" },
  { id: "utilities", label: "Utilities" },
  { id: "productivity", label: "Productivity" },
  { id: "uninstalled", label: "Not Installed" },
];

const APP_CATEGORIES = {
  paint: "utilities",
  terminal: "utilities",
  nautilus: "utilities",
  firefox: "utilities",
  dashboard: "productivity",
  notes: "productivity",
  media: "utilities",
  settings: "utilities",
  taskmanager: "utilities",
  contact: "productivity",
  about: "productivity",
  calendar: "productivity",
  store: "utilities",
  recycle: "utilities",
};

const APP_DESC = {
  nautilus: "Files — hardware/software projects with Awards, organized in hardware/software folders.",
  firefox: "Firefox — Brave-powered browsing with portfolio-friendly embedding and bookmarks.",
  terminal: "Terminal — explore 13 projects, stack, and contact via CLI.",
  dashboard: "Dashboard — live football, cricket, crypto, weather, news, and GitHub pulse.",
  paint: "Paint — pen/brush, shapes, fill, text, eyedropper, undo/redo, PNG export.",
  notes: "Notes — markdown notes with preview and local autosave.",
  media: "Media — Webamp Winamp + playlist fallback.",
  calendar: "Calendar — month/week, add events, dots and detail.",
  contact: "Contact — email/GitHub/location + chat.",
  taskmanager: "Task Manager — window and process overview.",
  settings: "Settings — wallpapers, accents, effects.",
  about: "Home — Ahmed Irfan Akrami workspace overview.",
  recycle: "Trash — deleted items staging.",
  store: "App Store — install/remove apps.",
};

export function AppStore() {
  const { addNotification } = useContext(AppContext);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showCategories, setShowCategories] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  const [installing, setInstalling] = useState(null);
  const [uninstalling, setUninstalling] = useState(null);
  const [installed, setInstalled] = useState(() => {
    try {
      const raw = localStorage.getItem("mintex_installed_apps");
      if (raw) return new Set(JSON.parse(raw));
      // default: all installed
      return new Set(desktopApps().map((a) => a.appId));
    } catch { return new Set(desktopApps().map((a) => a.appId)); }
  });

  const ALL_APPS = desktopApps();

  useEffect(() => {
    localStorage.setItem("mintex_installed_apps", JSON.stringify([...installed]));
  }, [installed]);

  // auto-select first filtered
  const filteredApps = useMemo(() => ALL_APPS.filter((app) => {
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!app.label.toLowerCase().includes(q) && !app.appId.toLowerCase().includes(q)) return false;
    }
    const cat = APP_CATEGORIES[app.appId] || "utilities";
    if (selectedCategory === "utilities" && cat !== "utilities") return false;
    if (selectedCategory === "productivity" && cat !== "productivity") return false;
    if (selectedCategory === "uninstalled" && installed.has(app.appId)) return false;
    return true;
  }), [search, selectedCategory, installed, ALL_APPS]);

  useEffect(() => {
    if (!selectedApp && filteredApps.length) setSelectedApp(filteredApps[0]);
    if (selectedApp && !filteredApps.find((a) => a.appId === selectedApp.appId)) {
      setSelectedApp(filteredApps[0] || null);
    }
  }, [filteredApps, selectedApp]);

  const isInstalled = (id) => installed.has(id);

  function handleInstall(app) {
    if (isInstalled(app.appId)) return;
    setInstalling(app.appId);
    addNotification({ title: "Installing", message: `${app.label}…`, duration: 1200 });
    setTimeout(() => {
      setInstalled((s) => new Set([...s, app.appId]));
      setInstalling(null);
      addNotification({ title: "Installed", message: `${app.label} ready`, duration: 2000 });
    }, 900);
  }
  function handleUninstall(app) {
    if (app.appId === "store") {
      addNotification({ title: "Cannot uninstall", message: "App Store is required", duration: 2000 });
      return;
    }
    setUninstalling(app.appId);
    addNotification({ title: "Removing", message: `${app.label}…`, duration: 800 });
    setTimeout(() => {
      setInstalled((s) => { const n = new Set(s); n.delete(app.appId); return n; });
      setUninstalling(null);
      addNotification({ title: "Removed", message: `${app.label} removed`, duration: 2000 });
    }, 700);
  }

  return (
    <div style={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0, background: "#1e1e1e" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", background: "#2d2d2d", borderBottom: "1px solid #333" }}>
        <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "center", maxWidth: 320 }}>
          <Search size={14} style={{ position: "absolute", left: 10, color: "#888" }} />
          <input
            placeholder="Search apps…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ width: "100%", padding: "7px 32px 7px 30px", background: "#1a1a1a", border: "1px solid #444", borderRadius: 8, color: "#ddd", outline: "none" }}
          />
          {search && <button onClick={() => setSearch("")} style={{ position: "absolute", right: 6, background: "transparent", border: 0, color: "#888", cursor: "pointer" }}><X size={14} /></button>}
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setShowCategories((v) => !v)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 12px", background: "#1a1a1a", border: "1px solid #444", borderRadius: 8, color: "#ddd", cursor: "pointer", fontSize: 12 }}>
            {CATEGORIES.find((c) => c.id === selectedCategory)?.label} {showCategories ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {showCategories && (
            <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#2d2d2d", border: "1px solid #444", borderRadius: 8, overflow: "hidden", minWidth: 160, zIndex: 20, boxShadow: "0 12px 24px rgba(0,0,0,0.4)" }}>
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => { setSelectedCategory(c.id); setShowCategories(false); }}
                  style={{ display: "block", width: "100%", textAlign: "left", padding: "8px 12px", background: selectedCategory === c.id ? "#E95420" : "transparent", color: selectedCategory === c.id ? "#fff" : "#ddd", border: 0, cursor: "pointer", fontSize: 12 }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
        <span style={{ fontSize: 11, color: "#888", whiteSpace: "nowrap" }}>{filteredApps.length} apps • {installed.size} installed</span>
      </div>

      <div style={{ flex: 1, display: "flex", minHeight: 0 }}>
        <div style={{ width: 220, borderRight: "1px solid #333", overflowY: "auto", background: "#1a1a1a" }}>
          {filteredApps.length === 0 ? (
            <div style={{ padding: 20, color: "#666", fontSize: 12 }}>No apps found.</div>
          ) : filteredApps.map((app) => (
            <button
              key={app.appId}
              onClick={() => setSelectedApp(app)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "10px 12px",
                background: selectedApp?.appId === app.appId ? "#E95420" : "transparent",
                color: selectedApp?.appId === app.appId ? "#fff" : "#ddd",
                border: 0, borderBottom: "1px solid #222", cursor: "pointer", textAlign: "left"
              }}
            >
              <span style={{ width: 32, height: 32, display: "grid", placeItems: "center", background: selectedApp?.appId === app.appId ? "rgba(255,255,255,0.15)" : "#2d2d2d", borderRadius: 8 }}>
                <app.icon size={18} />
              </span>
              <span style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{app.label}</div>
                <div style={{ fontSize: 10, opacity: 0.7 }}>{APP_CATEGORIES[app.appId]}</div>
              </span>
              {isInstalled(app.appId) ? <Check size={14} color={selectedApp?.appId === app.appId ? "#fff" : "#7bc67e"} /> : <Download size={14} color="#888" />}
            </button>
          ))}
        </div>

        <div style={{ flex: 1, padding: 18, overflowY: "auto" }}>
          {selectedApp ? (
            <>
              <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
                <span style={{ width: 56, height: 56, display: "grid", placeItems: "center", background: "#2d2d2d", borderRadius: 12, border: "1px solid #333" }}>
                  <selectedApp.icon size={32} color="#E95420" />
                </span>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{selectedApp.label}</div>
                  <div style={{ fontSize: 12, color: "#888" }}>{APP_CATEGORIES[selectedApp.appId]} • {isInstalled(selectedApp.appId) ? "Installed" : "Not installed"}</div>
                </div>
              </div>
              <p style={{ marginTop: 12, fontSize: 13, color: "#aaa", lineHeight: 1.5 }}>{APP_DESC[selectedApp.appId] || "Utility for Mintex Linux."}</p>
              <div style={{ marginTop: 14, display: "flex", gap: 8 }}>
                {isInstalled(selectedApp.appId) ? (
                  <button onClick={() => handleUninstall(selectedApp)} disabled={uninstalling === selectedApp.appId} style={{ padding: "9px 14px", background: "#2d2d2d", border: "1px solid #E95420", color: "#E95420", borderRadius: 8, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Trash2 size={14} /> {uninstalling === selectedApp.appId ? "Removing…" : "Uninstall"}
                  </button>
                ) : (
                  <button onClick={() => handleInstall(selectedApp)} disabled={installing === selectedApp.appId} style={{ padding: "9px 14px", background: "#E95420", border: 0, color: "#fff", borderRadius: 8, cursor: "pointer", fontSize: 12, display: "flex", alignItems: "center", gap: 6 }}>
                    <Download size={14} /> {installing === selectedApp.appId ? "Installing…" : "Install"}
                  </button>
                )}
              </div>
              <div style={{ marginTop: 16, padding: 10, background: "#1a1a1a", border: "1px solid #333", borderRadius: 8, fontSize: 11, color: "#666" }}>
                Tip: Installed apps appear in Dock & Activities search. Uninstalled ones move to “Not Installed”.
              </div>
            </>
          ) : (
            <div style={{ display: "grid", placeItems: "center", height: "100%", color: "#666" }}>
              <div style={{ textAlign: "center" }}><Download size={36} color="#444" /><div style={{ marginTop: 8, fontSize: 12 }}>Select an app</div></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
