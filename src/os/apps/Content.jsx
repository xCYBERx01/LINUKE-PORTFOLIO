import { useState, useEffect } from "react";
import { Mail, ExternalLink, Folder, TerminalSquare, Trash2, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { CONTACT, PROJECTS, projects, aboutStats } from "../data";

export function AboutWindow({ onOpenApp }) {
  const src = projects.length ? projects : PROJECTS;
  const hw = aboutStats?.hardware ?? src.filter((p) => ["Embedded", "Robotics", "Automation"].includes(p.group)).length;
  const sw = aboutStats?.software ?? src.filter((p) => ["Software", "AI"].includes(p.group)).length;
  const total = aboutStats?.projects ?? src.length;
  const stack = aboutStats?.stackCount ? `${aboutStats.stackCount}+` : "20+";
  return (
    <div className="os-content about">
      <p className="os-kicker">Linux portfolio workspace</p>
      <h1>Ahmed Irfan Akrami</h1>
      <p>
        Robotics, embedded systems, electronics, software, and research presented as a lightweight Linux
        desktop.
      </p>
      <div className="os-quick">
        <button onClick={() => onOpenApp("nautilus")}>
          <Folder size={15} /> Browse Projects
        </button>
        <button onClick={() => onOpenApp("terminal")}>
          <TerminalSquare size={15} /> Open Terminal
        </button>
      </div>
      <div className="os-stats">
        <div><span>Projects</span><strong>{String(total).padStart(2, "0")}</strong></div>
        <div><span>Hardware</span><strong>{String(hw).padStart(2, "0")}</strong></div>
        <div><span>Software</span><strong>{String(sw).padStart(2, "0")}</strong></div>
        <div><span>Stack</span><strong>{stack}</strong></div>
      </div>
    </div>
  );
}

export function ResumeWindow() {
  return (
    <div className="os-content doc">
      <p className="os-kicker">resume.md</p>
      <h1>Engineering Portfolio</h1>
      <section>
        <h2>Focus</h2>
        <p>Robotics systems, embedded firmware, practical electronics, technical documentation, and AI software.</p>
      </section>
      <section>
        <h2>Selected Work</h2>
        <ul>
          <li>Croc OS v0.5.4, an ESP32 companion with OLED personality, weather, NTP, and NVS memory.</li>
          <li>EdgeBot for Team VoltEdge at NRL 2025, focused on mechanical reliability under competition stress.</li>
          <li>AHMED-OS, Meadow, Kharcha, Sports Tournament Web App, Wildlife Card Game, and Robotics Circuits Skill.</li>
        </ul>
      </section>
      <section>
        <h2>Recognition</h2>
        <p>NRL Community Champions at IIT Bombay, with project work spanning hardware and software delivery.</p>
      </section>
    </div>
  );
}

export function ContactWindow() {
  return (
    <div className="os-content">
      <h1>Connect</h1>
      <p>For roles, collaborations, or project discussion.</p>
      <div className="os-contact">
        <a href={`mailto:${CONTACT.email}`}>
          <Mail size={16} /> {CONTACT.email}
        </a>
        <a href="https://github.com/xCYBERx01" target="_blank" rel="noreferrer">
          <ExternalLink size={16} /> {CONTACT.github}
        </a>
      </div>
    </div>
  );
}

const NOTES_KEY = "mintex_notes_v2";
const SAVE_KEY = "mintex_notes";

function renderMarkdown(src) {
  let html = src
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/^### (.+)$/gm, "<h3>$1</h3>")
    .replace(/^## (.+)$/gm, "<h2>$1</h2>")
    .replace(/^# (.+)$/gm, "<h1>$1</h1>")
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/`(.+?)`/g, "<code>$1</code>")
    .replace(/^-\s(.+)$/gm, "<li>$1</li>")
    .replace(/^>\s(.+)$/gm, "<blockquote>$1</blockquote>");
  html = html.replace(/(<li>.*<\/li>)/gs, (m) => `<ul>${m}</ul>`);
  html = html.split("\n").map((l) => l.trim().startsWith("<") ? l : l ? `<p>${l}</p>` : "").join("");
  return html;
}

export function NotepadWindow() {
  const [notes, setNotes] = useState(() => {
    try {
      const v2 = localStorage.getItem(NOTES_KEY);
      if (v2) return JSON.parse(v2);
      const legacy = localStorage.getItem(SAVE_KEY);
      if (legacy) return [{ id: "1", title: "Notes", text: legacy, updated: Date.now() }];
    } catch {}
    return [
      { id: "1", title: "Welcome", text: "# Welcome\n\nThis is your **markdown** notes.\n\n- Tap + New to create\n- Use toolbar: B/I, headings, lists, quote, code\n- Toggle Preview to render\n- Autosaved locally", updated: Date.now() },
      { id: "2", title: "Ideas", text: "## Ideas\n\n- Croc v0.5.4 polish\n- ProjectDirec scrapers\n- Dashboard cricket widget", updated: Date.now() - 1000 },
    ];
  });
  const [activeId, setActiveId] = useState(() => notes[0]?.id || "1");
  const [preview, setPreview] = useState(false);
  const [query, setQuery] = useState("");
  const active = notes.find((n) => n.id === activeId) || notes[0];

  useEffect(() => { localStorage.setItem(NOTES_KEY, JSON.stringify(notes)); }, [notes]);
  // migrate legacy key
  useEffect(() => { if (active) localStorage.setItem(SAVE_KEY, active.text); }, [active?.text]);

  function updateActive(patch) {
    setNotes((ns) => ns.map((n) => n.id === activeId ? { ...n, ...patch, title: (patch.text ?? n.text).split("\n")[0].replace(/^#+\s*/, "").slice(0, 32) || "Untitled", updated: Date.now() } : n));
  }
  function addNote() {
    const id = String(Date.now());
    const n = { id, title: "Untitled", text: "# Untitled\n\n", updated: Date.now() };
    setNotes((ns) => [n, ...ns]); setActiveId(id);
  }
  function deleteNote() {
    if (notes.length === 1) return;
    setNotes((ns) => ns.filter((n) => n.id !== activeId));
    setActiveId(notes.find((n) => n.id !== activeId)?.id || notes[0].id);
  }
  function wrapSelection(before, after = before) {
    const ta = document.getElementById("mintex-ta");
    if (!ta) return;
    const s = ta.selectionStart, e = ta.selectionEnd;
    const t = active.text;
    const next = t.slice(0, s) + before + t.slice(s, e) + after + t.slice(e);
    updateActive({ text: next });
    setTimeout(() => { ta.focus(); ta.setSelectionRange(s + before.length, e + before.length); }, 0);
  }
  function insertAtCursor(txt) {
    const ta = document.getElementById("mintex-ta");
    const s = ta ? ta.selectionStart : active.text.length;
    const t = active.text;
    updateActive({ text: t.slice(0, s) + txt + t.slice(s) });
  }

  const filtered = notes.filter((n) => !query || n.title.toLowerCase().includes(query.toLowerCase()) || n.text.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="os-notepad" style={{ flex: 1, display: "flex", minHeight: 0 }}>
      <div style={{ width: 200, borderRight: "1px solid #333", display: "flex", flexDirection: "column", background: "#1a1a1a" }}>
        <div style={{ display: "flex", gap: 6, padding: 8, borderBottom: "1px solid #333" }}>
          <button onClick={addNote} style={{ flex: 1, padding: "6px 8px", background: "#E95420", color: "#fff", border: 0, borderRadius: 6, cursor: "pointer", fontSize: 12 }}>+ New</button>
          <button onClick={deleteNote} style={{ padding: "6px 8px", background: "#2d2d2d", color: "#aaa", border: "1px solid #444", borderRadius: 6, cursor: "pointer" }}><Trash2 size={14} /></button>
        </div>
        <div style={{ padding: 6 }}>
          <input placeholder="Search notes…" value={query} onChange={(e) => setQuery(e.target.value)} style={{ width: "100%", padding: "6px 8px", background: "#0f0f0f", border: "1px solid #333", borderRadius: 6, color: "#ddd", fontSize: 12 }} />
        </div>
        <div style={{ flex: 1, overflowY: "auto" }}>
          {filtered.map((n) => (
            <button key={n.id} onClick={() => setActiveId(n.id)} style={{ width: "100%", textAlign: "left", padding: "10px 10px", background: n.id === activeId ? "#2d2d2d" : "transparent", border: 0, borderBottom: "1px solid #222", cursor: "pointer", color: n.id === activeId ? "#fff" : "#aaa" }}>
              <div style={{ fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.title}</div>
              <div style={{ fontSize: 11, opacity: 0.6, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{n.text.slice(0, 60)}</div>
              <div style={{ fontSize: 10, opacity: 0.4 }}>{new Date(n.updated).toLocaleDateString()}</div>
            </button>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0, minHeight: 0 }}>
        <div className="os-menubar" style={{ display: "flex", gap: 4, flexWrap: "wrap", background: "#2d2d2d", borderBottom: "1px solid #333", padding: "6px 8px" }}>
          <button onClick={() => wrapSelection("**")} title="Bold" style={{ padding: "5px 8px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#ddd", cursor: "pointer", fontSize: 12, fontWeight: 700 }}>B</button>
          <button onClick={() => wrapSelection("*")} title="Italic" style={{ padding: "5px 8px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#ddd", cursor: "pointer", fontSize: 12, fontStyle: "italic" }}>I</button>
          <button onClick={() => insertAtCursor("\n# Heading\n")} title="Heading" style={{ padding: "5px 8px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#ddd", cursor: "pointer", fontSize: 12 }}>H1</button>
          <button onClick={() => insertAtCursor("\n- item\n")} title="List" style={{ padding: "5px 8px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#ddd", cursor: "pointer", fontSize: 12 }}>• List</button>
          <button onClick={() => wrapSelection("\n> ", "")} title="Quote" style={{ padding: "5px 8px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#ddd", cursor: "pointer", fontSize: 12 }}>❝</button>
          <button onClick={() => wrapSelection("`")} title="Code" style={{ padding: "5px 8px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#ddd", cursor: "pointer", fontSize: 12 }}>{`<>`}</button>
          <div style={{ flex: 1 }} />
          <button onClick={() => setPreview((v) => !v)} style={{ padding: "6px 10px", background: preview ? "#E95420" : "#1e1e1e", color: preview ? "#fff" : "#aaa", border: "1px solid #444", borderRadius: 6, cursor: "pointer", fontSize: 12 }}>{preview ? "Edit" : "Preview"}</button>
          <button onClick={() => { navigator.clipboard?.writeText(active.text); }} style={{ padding: "6px 10px", background: "#1e1e1e", border: "1px solid #444", borderRadius: 6, color: "#aaa", cursor: "pointer", fontSize: 12 }}>Copy</button>
        </div>
        {preview ? (
          <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#1e1e1e", color: "#ddd", lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: renderMarkdown(active.text) }} />
        ) : (
          <textarea id="mintex-ta" value={active.text} onChange={(e) => updateActive({ text: e.target.value })} spellCheck={false} style={{ flex: 1, padding: 14, background: "#1e1e1e", color: "#ddd", border: 0, outline: 0, resize: "none", fontFamily: "var(--font-mono)", fontSize: 13, lineHeight: 1.6 }} />
        )}
        <div style={{ padding: "5px 8px", fontSize: 11, color: "#666", background: "#111", borderTop: "1px solid #222", display: "flex", justifyContent: "space-between" }}>
          <span>{active.text.length} chars • {active.text.split(/\s+/).filter(Boolean).length} words</span>
          <span>{new Date(active.updated).toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
}

export function SettingsWindow({ onSetWallpaper, wallpaper, accent, onAccent, onOpenApp }) {
  const wallpapers = [
    { id: "default", name: "Mintex Default", css: "default" },
    { id: "gnome", name: "GNOME Blue", css: "gnome" },
    { id: "ubuntu", name: "Ubuntu Purple", css: "ubuntu" },
    { id: "arch", name: "Arch", css: "arch" },
    { id: "pop", name: "Pop!_OS", css: "pop" },
    { id: "deep", name: "Deep Space", css: "deep" },
    { id: "mint", name: "Linux Mint", css: "mint" },
    { id: "solar", name: "Solar", css: "solar" },
  ];
  const accents = [
    { id: "teal", color: "var(--accent-teal)" },
    { id: "blue", color: "var(--accent-blue)" },
    { id: "purple", color: "var(--accent-purple)" },
    { id: "green", color: "var(--accent-green)" },
    { id: "orange", color: "var(--accent-orange)" },
    { id: "pink", color: "var(--accent-pink)" },
  ];
  const [anim, setAnim] = useState(() => localStorage.getItem("mintex_anim") !== "0");
  const [blur, setBlur] = useState(() => localStorage.getItem("mintex_blur") !== "0");
  const [reduce, setReduce] = useState(() => localStorage.getItem("mintex_reduce") === "1");
  const [croc, setCroc] = useState(() => localStorage.getItem("mintex_croc_hidden") !== "1");
  const [iconSize, setIconSize] = useState(() => Number(localStorage.getItem("mintex_icon_size") || 80));

  useEffect(() => { localStorage.setItem("mintex_anim", anim ? "1" : "0"); document.documentElement.dataset.anim = anim ? "1" : "0"; }, [anim]);
  useEffect(() => { localStorage.setItem("mintex_blur", blur ? "1" : "0"); document.documentElement.dataset.blur = blur ? "1" : "0"; }, [blur]);
  useEffect(() => { localStorage.setItem("mintex_reduce", reduce ? "1" : "0"); document.documentElement.dataset.reduce = reduce ? "1" : "0"; }, [reduce]);
  useEffect(() => { localStorage.setItem("mintex_croc_hidden", croc ? "0" : "1"); }, [croc]);
  useEffect(() => { localStorage.setItem("mintex_icon_size", String(iconSize)); document.documentElement.style.setProperty("--dock-icon-size", `${iconSize}px`); }, [iconSize]);

  return (
    <div className="os-settings" style={{ overflowY: "auto" }}>
      <h2>Appearance</h2>
      <div className="os-setting-group">
        <h3>Wallpaper</h3>
        <div className="os-wallpapers">
          {wallpapers.map((w) => (
            <button key={w.id} className={wallpaper === w.id ? "active" : ""} style={{ backgroundImage: `var(--wall-${w.id})` }} onClick={() => onSetWallpaper(w.id)}>
              <span>{w.name}</span>
            </button>
          ))}
        </div>
      </div>
      <div className="os-setting-group">
        <h3>Accent Color</h3>
        <div className="os-accents">
          {accents.map((a) => (
            <button key={a.id} className={accent === a.id ? "active" : ""} style={{ background: a.color }} onClick={() => onAccent(a.id)} />
          ))}
        </div>
        <div style={{ marginTop: 8, fontSize: 11, color: "#888" }}>Accent tints active window, dock dot & buttons.</div>
      </div>

      <h2>Desktop</h2>
      <div className="os-setting-group">
        <h3>Effects</h3>
        <div className="os-toggles">
          <label className="os-toggle">
            <input type="checkbox" checked={anim} onChange={(e) => setAnim(e.target.checked)} />
            <span className="os-toggle-slider"></span>
            <span>Window animations</span>
          </label>
          <label className="os-toggle">
            <input type="checkbox" checked={blur} onChange={(e) => setBlur(e.target.checked)} />
            <span className="os-toggle-slider"></span>
            <span>Top bar & Dock blur</span>
          </label>
          <label className="os-toggle">
            <input type="checkbox" checked={reduce} onChange={(e) => setReduce(e.target.checked)} />
            <span className="os-toggle-slider"></span>
            <span>Reduce motion</span>
          </label>
          <label className="os-toggle">
            <input type="checkbox" checked={croc} onChange={(e) => setCroc(e.target.checked)} />
            <span className="os-toggle-slider"></span>
            <span>Croc companion (FACEMODE)</span>
          </label>
        </div>
        {reduce && <div style={{ marginTop: 8, fontSize: 11, color: "#E95420" }}>Reduce motion disables spring animations.</div>}
      </div>

      <div className="os-setting-group">
        <h3>Dock Icon Size</h3>
        <div className="os-icon-size">
          <input type="range" min={56} max={96} step={4} value={iconSize} onChange={(e) => setIconSize(Number(e.target.value))} />
          <span>{iconSize}px</span>
        </div>
        <div style={{ fontSize: 11, color: "#666" }}>Live preview — affects left dock.</div>
      </div>

      <div className="os-setting-group">
        <h3>Quick Actions</h3>
        <div className="os-quick">
          <button onClick={() => onOpenApp("taskmanager")}>Task Manager</button>
          <button onClick={() => onOpenApp("terminal")}>Terminal</button>
          <button onClick={() => onOpenApp("store")}>App Store</button>
          <button onClick={() => { localStorage.clear(); location.reload(); }} style={{ borderColor: "#E95420", color: "#E95420" }}>Reset All</button>
        </div>
      </div>

      <div className="os-setting-group">
        <h3>About</h3>
        <p className="os-about">Mintex Linux 2.1.0<br />Kernel 6.6.1-mintex<br />Built with React + Vite<br />13 projects • SH110X 1.3″ cyber blue • Croc v0.5.3</p>
      </div>
    </div>
  );
}

export function CalendarWindow() {
  const [date, setDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [view, setView] = useState("month"); // month | week
  const [events, setEvents] = useState(() => {
    try { return JSON.parse(localStorage.getItem("mintex_calendar_events") || "[]"); } catch { return []; }
  });
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState({ title: "", time: "10:00", color: "#E95420" });

  useEffect(() => { localStorage.setItem("mintex_calendar_events", JSON.stringify(events)); }, [events]);

  const currentMonth = date.getMonth();
  const currentYear = date.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const today = new Date();

  const prev = () => view === "month" ? setDate(new Date(currentYear, currentMonth - 1, 1)) : setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7));
  const next = () => view === "month" ? setDate(new Date(currentYear, currentMonth + 1, 1)) : setDate((d) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + 7));
  const goToday = () => { const n = new Date(); setDate(n); setSelectedDate(n); };

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  function keyFor(d) { return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`; }
  function eventsFor(d) { const k = keyFor(d); return events.filter((e) => e.key === k); }

  function addEvent() {
    if (!draft.title.trim()) return;
    const k = keyFor(selectedDate);
    const ev = { id: Date.now(), key: k, date: selectedDate.toISOString(), title: draft.title.trim(), time: draft.time, color: draft.color };
    setEvents((e) => [...e, ev]);
    setShowAdd(false); setDraft({ title: "", time: "10:00", color: "#E95420" });
  }
  function deleteEvent(id) { setEvents((e) => e.filter((x) => x.id !== id)); }

  // week view: start Sunday of date's week
  const weekStart = new Date(date); weekStart.setDate(date.getDate() - weekStart.getDay());
  const weekDaysDates = Array.from({ length: 7 }, (_, i) => { const d = new Date(weekStart); d.setDate(weekStart.getDate() + i); return d; });

  return (
    <div className="os-calendar">
      <div className="os-calendar-header">
        <button onClick={prev}><ChevronLeft size={16} /></button>
        <h2>{view === "month" ? `${monthNames[currentMonth]} ${currentYear}` : `${weekStart.toLocaleDateString()} — ${weekDaysDates[6].toLocaleDateString()}`}</h2>
        <button onClick={next}><ChevronRight size={16} /></button>
        <button onClick={goToday} className="os-calendar-today">Today</button>
        <select value={view} onChange={(e) => setView(e.target.value)} style={{ marginLeft: 8, background: "#2d2d2d", color: "#ddd", border: "1px solid #444", borderRadius: 6, padding: "4px 6px", fontSize: 12 }}>
          <option value="month">Month</option>
          <option value="week">Week</option>
        </select>
        <button onClick={() => setShowAdd(true)} style={{ marginLeft: 6, background: "#E95420", color: "#fff", border: 0, borderRadius: 6, padding: "6px 10px", fontSize: 12, cursor: "pointer" }}>+ Event</button>
      </div>

      {view === "month" ? (
        <div className="os-calendar-grid">
          {weekDays.map((d) => <div key={d} className="os-calendar-weekday">{d}</div>)}
          {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} className="os-calendar-day empty" />)}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day = i + 1;
            const d = new Date(currentYear, currentMonth, day);
            const isToday = today.getDate() === day && today.getMonth() === currentMonth && today.getFullYear() === currentYear;
            const isSelected = selectedDate.getDate() === day && selectedDate.getMonth() === currentMonth && selectedDate.getFullYear() === currentYear;
            const evs = eventsFor(d);
            return (
              <div key={day} className={`os-calendar-day ${isToday ? "today" : ""} ${isSelected ? "selected" : ""}`} onClick={() => setSelectedDate(d)} style={{ position: "relative" }}>
                {day}
                {evs.length > 0 && <span style={{ position: "absolute", bottom: 2, left: "50%", transform: "translateX(-50%)", display: "flex", gap: 2 }}>{evs.slice(0, 3).map((e) => <span key={e.id} style={{ width: 5, height: 5, borderRadius: 50, background: e.color }} />)}</span>}
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 6 }}>
          {weekDaysDates.map((d) => {
            const isToday = d.toDateString() === today.toDateString();
            const isSelected = d.toDateString() === selectedDate.toDateString();
            const evs = eventsFor(d);
            return (
              <div key={d.toISOString()} onClick={() => setSelectedDate(new Date(d))} style={{ background: isSelected ? "#E95420" : isToday ? "#2d2d2d" : "#1a1a1a", border: `1px solid ${isSelected ? "#E95420" : "#333"}`, borderRadius: 8, padding: 8, minHeight: 110, cursor: "pointer" }}>
                <div style={{ fontSize: 11, color: isSelected ? "#fff" : "#888" }}>{weekDays[d.getDay()]} <strong style={{ color: isSelected ? "#fff" : "#ddd" }}>{d.getDate()}</strong></div>
                <div style={{ marginTop: 6, display: "flex", flexDirection: "column", gap: 4 }}>
                  {evs.map((e) => (
                    <div key={e.id} style={{ fontSize: 11, background: "#2d2d2d", borderLeft: `3px solid ${e.color}`, padding: "4px 6px", borderRadius: 4, color: "#ddd", display: "flex", justifyContent: "space-between" }}>
                      <span>{e.time} {e.title}</span>
                      <button onClick={(ev) => { ev.stopPropagation(); deleteEvent(e.id); }} style={{ background: "transparent", border: 0, color: "#888", cursor: "pointer" }}>×</button>
                    </div>
                  ))}
                  {evs.length === 0 && <span style={{ fontSize: 11, color: "#555" }}>No events</span>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="os-calendar-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
        <p>Selected: {selectedDate.toLocaleDateString()} • {eventsFor(selectedDate).length} event(s)</p>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {eventsFor(selectedDate).map((e) => (
            <span key={e.id} style={{ fontSize: 11, background: "#1a1a1a", border: `1px solid ${e.color}`, padding: "4px 8px", borderRadius: 999, color: "#ddd" }}>
              {e.time} {e.title} <button onClick={() => deleteEvent(e.id)} style={{ background: "transparent", border: 0, color: "#E95420", cursor: "pointer", marginLeft: 4 }}>×</button>
            </span>
          ))}
        </div>
      </div>

      {showAdd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "grid", placeItems: "center", zIndex: 5000 }} onClick={() => setShowAdd(false)}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#1e1e1e", border: "1px solid #333", borderRadius: 12, padding: 16, width: 320, display: "flex", flexDirection: "column", gap: 10 }}>
            <strong style={{ color: "#fff" }}>Add event — {selectedDate.toLocaleDateString()}</strong>
            <input placeholder="Title (e.g., Team sync)" value={draft.title} onChange={(e) => setDraft({ ...draft, title: e.target.value })} style={{ padding: "8px 10px", background: "#2d2d2d", border: "1px solid #444", borderRadius: 8, color: "#ddd" }} />
            <div style={{ display: "flex", gap: 8 }}>
              <input type="time" value={draft.time} onChange={(e) => setDraft({ ...draft, time: e.target.value })} style={{ flex: 1, padding: "8px 10px", background: "#2d2d2d", border: "1px solid #444", borderRadius: 8, color: "#ddd" }} />
              <input type="color" value={draft.color} onChange={(e) => setDraft({ ...draft, color: e.target.value })} style={{ width: 44, height: 36, border: 0, background: "transparent" }} />
            </div>
            <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
              <button onClick={() => setShowAdd(false)} style={{ padding: "8px 12px", background: "#2d2d2d", border: "1px solid #444", borderRadius: 8, color: "#aaa", cursor: "pointer" }}>Cancel</button>
              <button onClick={addEvent} style={{ padding: "8px 14px", background: "#E95420", border: 0, borderRadius: 8, color: "#fff", cursor: "pointer" }}>Add</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
