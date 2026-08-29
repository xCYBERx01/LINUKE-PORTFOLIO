import { useState } from "react";
import {
  Wifi,
  Volume2,
  Battery,
  Power,
  Settings,
  User,
  ChevronDown,
} from "lucide-react";

export default function TopBar({ now, onOpenApp, onShutdown, onActivities }) {
  const [menuOpen, setMenuOpen] = useState(false);

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function formatDate(date) {
    return date.toLocaleDateString([], {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <div className="gnome-topbar">
      <button className="gnome-topbar-activities" onClick={onActivities}>
        Activities
      </button>

      <div className="gnome-topbar-center">
        <button className="gnome-topbar-clock" onClick={() => onOpenApp("calendar")}>
          {formatDate(now)} &nbsp; {formatTime(now)}
        </button>
      </div>

      <div className="gnome-topbar-right">
        <button
          className="gnome-topbar-systray"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Wifi size={14} />
          <Volume2 size={14} />
          <Battery size={14} />
          <ChevronDown size={10} />
        </button>

        {menuOpen && (
          <>
            <div
              className="gnome-topbar-backdrop"
              onClick={() => setMenuOpen(false)}
            />
            <div className="gnome-topbar-menu">
              <button
                onClick={() => {
                  onOpenApp("settings");
                  setMenuOpen(false);
                }}
              >
                <Settings size={14} /> Settings
              </button>
              <button
                onClick={() => {
                  onShutdown();
                  setMenuOpen(false);
                }}
              >
                <Power size={14} /> Power Off
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
