import { desktopApps } from "../registry";

const PINNED = ["nautilus", "firefox", "terminal", "settings", "contact"];

export default function Dock({ openApps, activeId, onOpen }) {
  const all = desktopApps();
  const pinned = PINNED.map((id) => all.find((a) => a.appId === id)).filter(Boolean);
  const running = openApps.filter((id) => !PINNED.includes(id));
  const runningApps = running
    .map((id) => all.find((a) => a.appId === id))
    .filter(Boolean);

  return (
    <div className="gnome-dock">
      {pinned.map((app) => {
        const Icon = app.icon;
        const isOpen = openApps.includes(app.appId);
        const isActive = activeId === app.appId;
        return (
          <button
            key={app.appId}
            className={`gnome-dock-item ${isActive ? "active" : ""} ${isOpen ? "open" : ""}`}
            onClick={() => onOpen(app.appId)}
            title={app.label}
          >
            <Icon size={22} />
            {isOpen && <div className="gnome-dock-dot" />}
          </button>
        );
      })}
      {runningApps.length > 0 && (
        <div className="gnome-dock-separator" />
      )}
      {runningApps.map((app) => {
        const Icon = app.icon;
        const isActive = activeId === app.appId;
        return (
          <button
            key={app.appId}
            className={`gnome-dock-item ${isActive ? "active" : ""}`}
            onClick={() => onOpen(app.appId)}
            title={app.label}
          >
            <Icon size={22} />
            <div className="gnome-dock-dot" />
          </button>
        );
      })}
    </div>
  );
}
