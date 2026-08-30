import { useEffect, useState } from "react";
import {
  Power,
  Monitor,
  Wifi,
  Search,
  Menu,
  LogOut,
  RotateCcw,
  X,
  TerminalSquare,
} from "lucide-react";
import { desktopApps } from "./registry";
import { RightClickMenu } from "./components/RightClickMenu";
import { DraggableIcon } from "./components/DraggableIcon";

export function formatClock(date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatDate(date) {
  return date.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
}

/* ---------------- Shutdown ---------------- */
export function ShutdownDialog({ onShutdown, onRestart, onLogout, onCancel }) {
  return (
    <div className="os-shutdown-overlay">
      <div className="os-shutdown-card">
        <div className="os-shutdown-head">
          <Power size={20} />
          <span>Power Off</span>
        </div>
        <p>Choose an option</p>
        <button onClick={onShutdown}><Power size={15} /> <span>Shut Down</span></button>
        <button onClick={onRestart}><RotateCcw size={15} /> <span>Restart</span></button>
        <button onClick={onLogout}><LogOut size={15} /> <span>Log Out</span></button>
        <button className="cancel" onClick={onCancel}><X size={15} /> <span>Cancel</span></button>
      </div>
    </div>
  );
}

/* ---------------- Desktop Icon ---------------- */
export function DesktopIcons({ items, selected, onSelect, onOpen, onContext }) {
  const [rightClick, setRightClick] = useState(null);

  function handleContextMenu(e, item) {
    e.preventDefault();
    e.stopPropagation();
    const actions = onContext(e, item);
    setRightClick({ x: e.clientX, y: e.clientY, items: actions, target: item, type: "icon" });
  }

  function handleDesktopContextMenu(e) {
    e.preventDefault();
    const actions = onContext(e, null);
    setRightClick({ x: e.clientX, y: e.clientY, items: actions, target: null, type: "desktop" });
  }

  function handleAction(action, value) {
    if (action === "arrange") {
      // Handle arrange action
    }
  }

  function handleDragStop(key, x, y) {
    // Update item position in localStorage
    const stored = localStorage.getItem("mintex_desktop_items");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        const updated = parsed.map(item => item.key === key ? { ...item, x, y } : item);
        localStorage.setItem("mintex_desktop_items", JSON.stringify(updated));
      } catch {}
    }
  }

  return (
    <div className="os-desktop-icons" onClick={() => { onSelect(null); setRightClick(null); }} onContextMenu={handleDesktopContextMenu}>
      {items.map((item) => (
        <DraggableIcon
          key={item.key}
          item={item}
          selected={selected}
          onSelect={onSelect}
          onOpen={onOpen}
          onContextMenu={handleContextMenu}
          onDragStop={handleDragStop}
        />
      ))}
      {rightClick && (
        <RightClickMenu
          visible={true}
          x={rightClick.x}
          y={rightClick.y}
          items={rightClick.items}
          onClose={() => setRightClick(null)}
          onAction={handleAction}
          type={rightClick.type}
          target={rightClick.target}
        />
      )}
    </div>
  );
}

/* ---------------- App Menu ---------------- */
export function AppMenu({ open, onClose, onOpen }) {
  const [q, setQ] = useState("");
  if (!open) return null;
  const groups = {
    Favorites: ["about", "projects", "resume", "terminal", "contact"],
    Apps: ["files", "notes", "paint", "media", "settings"],
    System: ["taskmanager", "crypto", "news", "browser"],
  };
  const all = desktopApps();
  const byId = Object.fromEntries(all.map((a) => [a.appId, a]));
  const filtered = q
    ? all.filter((a) => a.label.toLowerCase().includes(q.toLowerCase()))
    : null;

  return (
    <>
      <div className="os-menu-backdrop" onClick={onClose} />
      <div className="os-appmenu">
        <div className="os-appmenu-head">
          <Monitor size={16} />
          <span>Mintex Apps</span>
        </div>
        <div className="os-appmenu-search">
          <Search size={14} />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search apps…" />
        </div>
        <div className="os-appmenu-list">
          {(filtered || Object.entries(groups)).map((entry) => {
            if (Array.isArray(entry)) {
              const [group, ids] = entry;
              return (
                <div className="os-appmenu-group" key={group}>
                  <span className="os-appmenu-group-label">{group}</span>
                  {ids.map((id) => {
                    const app = byId[id];
                    const Icon = app.icon;
                    return (
                      <button key={id} onClick={() => { onOpen(id); onClose(); }}>
                        <Icon size={18} /> {app.label}
                      </button>
                    );
                  })}
                </div>
              );
            }
            const Icon = entry.icon;
            return (
              <button key={entry.appId} onClick={() => { onOpen(entry.appId); onClose(); }}>
                <Icon size={18} /> {entry.label}
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

/* ---------------- Context Menu ---------------- */
export function ContextMenu({ pos, actions }) {
  if (!actions.length) return null;
  return (
    <div className="os-context" style={{ left: pos.x, top: pos.y }}>
      {actions.map((a) => (
        <button key={a.label} onClick={a.run}>
          <a.icon size={14} /> {a.label}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Taskbar ---------------- */
export function Taskbar({
  now,
  openApps,
  activeId,
  onFocus,
  onClose,
  onMenuToggle,
  menuOpen,
  onShutdown,
  favorites,
}) {
  return (
    <div className="os-taskbar">
      <button className={menuOpen ? "os-task-app active" : "os-task-app"} onClick={onMenuToggle}>
        <Menu size={16} />
        <span>Apps</span>
      </button>
      <div className="os-task-sep" />
      <div className="os-tasklist">
        {favorites.map((f) => {
          const Icon = f.icon;
          return (
            <button
              key={f.appId}
              title={f.label}
              onClick={() => onFocus(f.appId)}
            >
              <Icon size={16} />
            </button>
          );
        })}
        {openApps.map((id) => {
          const app = desktopApps().find((a) => a.appId === id);
          if (!app) return null;
          const Icon = app.icon;
          return (
            <button
              key={id}
              className={activeId === id ? "active" : ""}
              onClick={() => onFocus(id)}
              onContextMenu={(e) => {
                e.preventDefault();
                onClose(id);
              }}
            >
              <Icon size={15} />
              <span>{app.label}</span>
            </button>
          );
        })}
      </div>
      <div className="os-tray">
        <Wifi size={14} />
        <span className="os-tray-wifi">Wi-Fi</span>
        <span className="os-tray-clock">{formatClock(now)}</span>
        <span className="os-tray-date">{formatDate(now)}</span>
        <button className="os-tray-power" onClick={onShutdown} title="Power"><Power size={14} /></button>
      </div>
    </div>
  );
}
