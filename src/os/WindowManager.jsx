import { useEffect, useRef, useState } from "react";
import { X, Minus, Square } from "lucide-react";

const RESIZE_HANDLES = ["n", "s", "e", "w", "ne", "nw", "se", "sw"];
const MIN_SIZE = { w: 320, h: 220 };

export default function WindowManager({
  windows,
  activeId,
  onFocus,
  onClose,
  onMinimize,
  onToggleMax,
  registry,
  onUpdate,
}) {
  return (
    <>
      {windows.map((win) => {
        const app = registry[win.appId];
        if (win.minimized) return null;
        const active = activeId === win.id;
        return (
          <Window
            key={win.id}
            win={win}
            app={app}
            active={active}
            onFocus={() => onFocus(win.id)}
            onClose={() => onClose(win.id)}
            onMinimize={() => onMinimize(win.id)}
            onToggleMax={() => onToggleMax(win.id)}
            onUpdate={(patch) => onUpdate(win.id, patch)}
          />
        );
      })}
    </>
  );
}

function Window({ win, app, active, onFocus, onClose, onMinimize, onToggleMax, onUpdate }) {
  const [drag, setDrag] = useState(null);
  const [resize, setResize] = useState(null);
  const dragStart = useRef(null);
  const origin = useRef(null);
  const Icon = app.icon;

  function beginDrag(e) {
    if (win.max) return;
    e.preventDefault();
    dragStart.current = { x: e.clientX - win.x, y: e.clientY - win.y };
    origin.current = { ...win };
    setDrag(true);
  }

  function beginResize(side) {
    if (win.max) return;
    origin.current = { ...win };
    setResize({ side });
  }

  useEffect(() => {
    if (!drag && !resize) return;
    function onMove(e) {
      if (drag) {
        let nx = e.clientX - dragStart.current.x;
        let ny = e.clientY - dragStart.current.y;
        // clamp so titlebar stays visible
        nx = Math.max(-win.w + 80, Math.min(window.innerWidth - 80, nx));
        ny = Math.max(30, Math.min(window.innerHeight - 50, ny));
        onUpdate({ x: nx, y: ny });
      } else if (resize) {
        const d = resize;
        const o = origin.current;
        let { x, y, w, h } = o;
        if (d.side.includes("e")) w = e.clientX - o.x;
        if (d.side.includes("s")) h = e.clientY - o.y;
        if (d.side.includes("w")) {
          const nx = e.clientX;
          w = o.x + o.w - nx;
          x = nx;
        }
        if (d.side.includes("n")) {
          const ny = e.clientY;
          h = o.y + o.h - ny;
          y = ny;
        }
        w = Math.max(MIN_SIZE.w, Math.min(w, window.innerWidth - x - 8));
        h = Math.max(MIN_SIZE.h, Math.min(h, window.innerHeight - y - 8));
        // prevent negative
        if (x < -20) { w += x + 20; x = -20; }
        if (y < 30) { h += y - 30; y = 30; }
        onUpdate({ x, y, w, h });
      }
    }
    function onUp() {
      setDrag(false);
      setResize(false);
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
  }, [drag, resize, win.w, win.h, onUpdate]);

  const isDragging = drag || resize;

  return (
    <section
      className={`os-window ${active ? "active" : ""} ${win.max ? "maximized" : ""} ${isDragging ? "dragging" : ""}`}
      style={{
        left: win.max ? 0 : win.x,
        top: win.max ? 0 : win.y,
        width: win.max ? "100%" : win.w,
        height: win.max ? "100%" : win.h,
        zIndex: win.z,
      }}
      onMouseDown={onFocus}
    >
      <header
        className="os-window-titlebar"
        onMouseDown={beginDrag}
        onDoubleClick={onToggleMax}
      >
        <div className="os-window-icon">
          <Icon size={14} />
          <span>{app.name}</span>
        </div>
        <div className="os-window-controls">
          <button className="os-btn os-btn-min" title="Minimize" onClick={onMinimize} aria-label="Minimize window">
            <Minus size={13} />
          </button>
          <button className="os-btn os-btn-max" title="Maximize" onClick={onToggleMax} aria-label="Maximize window">
            <Square size={10} />
          </button>
          <button className="os-btn os-btn-close" title="Close" onClick={onClose} aria-label="Close window">
            <X size={13} />
          </button>
        </div>
      </header>
      <div className="os-window-body" style={{ position: "relative" }}>
        {<app.component win={win} onUpdate={onUpdate} />}
        {isDragging && <div style={{ position: "absolute", inset: 0, zIndex: 10 }} />}
      </div>
      {!win.max &&
        RESIZE_HANDLES.map((h) => (
          <div key={h} className={`os-resize os-resize-${h}`} onMouseDown={(e) => { e.stopPropagation(); beginResize(h); }} />
        ))}
    </section>
  );
}
