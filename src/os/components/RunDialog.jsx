import { useState, useEffect, useRef, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Draggable from "react-draggable";
import { Search, X, Minus, Square, TerminalSquare, FolderOpen, Globe } from "lucide-react";
import { desktopApps } from "../registry";
import AppContext from "../AppContext";

const RUN_COMMANDS = {
  terminal: { label: "Terminal", icon: TerminalSquare, appId: "terminal" },
  nautilus: { label: "Files", icon: FolderOpen, appId: "nautilus" },
  files: { label: "Files", icon: FolderOpen, appId: "nautilus" },
  firefox: { label: "Firefox", icon: Globe, appId: "firefox" },
  browser: { label: "Firefox", icon: Globe, appId: "firefox" },
  settings: { label: "Settings", icon: Square, appId: "settings" },
  store: { label: "App Store", icon: Square, appId: "store" },
  taskmanager: { label: "Task Manager", icon: Square, appId: "taskmanager" },
  about: { label: "Home", icon: Square, appId: "about" },
  notes: { label: "Notes", icon: Square, appId: "notes" },
  paint: { label: "Paint", icon: Square, appId: "paint" },
  media: { label: "Media Player", icon: Square, appId: "media" },
  dashboard: { label: "Dashboard", icon: Square, appId: "dashboard" },
  contact: { label: "Contact", icon: Square, appId: "contact" },
  calendar: { label: "Calendar", icon: Square, appId: "calendar" },
  recycle: { label: "Trash", icon: Square, appId: "recycle" },
};

export function RunDialog({ open, onClose, onOpen }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const inputRef = useRef(null);
  const { addNotification } = useContext(AppContext);

  useEffect(() => {
    if (open) {
      setInput("");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "r") {
        e.preventDefault();
        onClose();
      }
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  useEffect(() => {
    const apps = desktopApps();
    const matches = Object.entries(RUN_COMMANDS)
      .filter(([key, cmd]) => key.includes(input.toLowerCase()) || cmd.label.toLowerCase().includes(input.toLowerCase()))
      .slice(0, 8)
      .map(([key, cmd]) => ({ key, ...cmd }));
    setSuggestions(matches);
  }, [input]);

  function handleSubmit(e) {
    e.preventDefault();
    const cmd = input.trim().toLowerCase();
    if (!cmd) return;

    if (RUN_COMMANDS[cmd]) {
      onOpen(RUN_COMMANDS[cmd].appId);
      addNotification({ title: "Opening", message: RUN_COMMANDS[cmd].label, duration: 1500 });
    } else if (cmd.startsWith("http://") || cmd.startsWith("https://")) {
      onOpen("firefox");
      addNotification({ title: "Opening URL", message: cmd, duration: 1500 });
    } else {
      addNotification({ title: "Unknown Command", message: `'${cmd}' not found`, duration: 2000 });
    }
    onClose();
  }

  function handleSuggestionClick(cmd) {
    onOpen(cmd.appId);
    addNotification({ title: "Opening", message: cmd.label, duration: 1500 });
    onClose();
  }

  if (!open) return null;

  return (
    <Draggable
      axis="both"
      handle=".os-run-titlebar"
      grid={[1, 1]}
      defaultPosition={{ x: window.innerWidth / 2 - 200, y: window.innerHeight / 2 - 100 }}
    >
      <motion.div
        className="os-run"
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: -20 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
      >
        <header className="os-run-titlebar">
          <div className="os-run-title">
            <Search size={16} /> Run
          </div>
          <button className="os-run-close" onClick={onClose}><X size={14} /></button>
        </header>

        <form onSubmit={handleSubmit} className="os-run-form">
          <div className="os-run-input-wrap">
            <Search size={16} className="os-run-search-icon" />
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a command, app name, or URL…"
              autoComplete="off"
              spellCheck={false}
            />
          </div>

          {suggestions.length > 0 && (
            <motion.ul className="os-run-suggestions" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
              {suggestions.map((cmd) => (
                <li key={cmd.key} onClick={() => handleSuggestionClick(cmd)}>
                  <cmd.icon size={16} /> {cmd.label}
                </li>
              ))}
            </motion.ul>
          )}

          <div className="os-run-hint">
            <kbd>⌘</kbd>+<kbd>R</kbd> to close · <kbd>Esc</kbd> to cancel
          </div>
        </form>
      </motion.div>
    </Draggable>
  );
}