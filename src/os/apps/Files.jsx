import { useState } from "react";
import {
  Home,
  Folder,
  FolderOpen,
  Code2,
  Cpu,
  Search,
  ExternalLink,
  FileText,
  Trophy,
  Activity,
  Wrench,
  Monitor,
  Image,
} from "lucide-react";
import { PROJECTS, CONTACT } from "../data";

const groupIcons = {
  Embedded: Cpu,
  Robotics: Trophy,
  Automation: Wrench,
  Software: Monitor,
  AI: Activity,
};

export function ProjectsWindow() {
  const [selected, setSelected] = useState(PROJECTS[0]);
  const [filter, setFilter] = useState("All");

  const groups = ["All", "Embedded", "Robotics", "Automation", "Software", "AI"];
  const shown = filter === "All" ? PROJECTS : PROJECTS.filter((p) => p.group === filter);

  function openProject(p) {
    setSelected(p);
  }

  const sidebarItems = [
    { key: "All", label: "All Projects", icon: Folder },
    { key: "Software", label: "Software", icon: Code2 },
    { key: "Hardware", label: "Hardware", icon: Cpu },
  ];

  return (
    <div className="os-files">
      <aside className="os-sidebar">
        <button onClick={() => setFilter("All")}>
          <Home size={15} />
          Home
        </button>
        {sidebarItems.map((s) => (
          <button
            className={filter === s.key || (s.key === "Hardware" && (filter === "Embedded" || filter === "Robotics" || filter === "Automation")) ? "active" : ""}
            key={s.key}
            onClick={() => setFilter(s.key)}
          >
            <s.icon size={15} />
            {s.label}
          </button>
        ))}
      </aside>
      <div className="os-filegrid">
        <div className="os-pathbar">
          <Search size={13} />
          <span>/home/ahmed/projects{filter !== "All" ? `/${filter.toLowerCase()}` : ""}</span>
        </div>
        <div className="os-project-tags">
          {groups.map((g) => (
            <button key={g} className={filter === g ? "active" : ""} onClick={() => setFilter(g)}>{g}</button>
          ))}
        </div>
        <div className="os-project-grid">
          {shown.map((p) => {
            const Icon = groupIcons[p.group] || Folder;
            const isActive = selected.id === p.id;
            return (
              <button
                key={p.id}
                className={isActive ? "os-project active" : "os-project"}
                onClick={() => openProject(p)}
              >
                <Icon size={26} />
                <span>{p.name}</span>
                <small>{p.group}</small>
              </button>
            );
          })}
        </div>
      </div>
      <aside className="os-inspector">
        <div className="os-inspector-head">
          <FolderOpen size={22} />
          <div>
            <h2>{selected.name}</h2>
            <span>{selected.path}</span>
          </div>
        </div>
        <p>{selected.summary}</p>
        <dl>
          <dt>Stack</dt>
          <dd>{selected.details}</dd>
        </dl>
        <a className="os-link" href="https://github.com/xCYBERx01" target="_blank" rel="noreferrer">
          <ExternalLink size={14} />
          GitHub
        </a>
      </aside>
    </div>
  );
}

export function FilesWindow() {
  const [view, setView] = useState("home");
  const folders = {
    home: ["Projects", "Documents", "Downloads", "Pictures", "Music", "Videos", "Public"],
    documents: ["Resume.md", "notes.txt", "todo.txt", "about.txt"],
    downloads: ["croc-os-v0.5.4.zip", "robot.ino", "schematic.pdf"],
    pictures: ["meadow.png", "edgebot.jpg", "kharcha.png"],
  };
  const activeFolder = view === "home" ? folders.home : folders[view] || folders.home;
  const locations = [
    { id: "home", label: "Home", icon: Home },
    { id: "projects", label: "Projects", icon: Folder },
    { id: "documents", label: "Documents", icon: FileText },
    { id: "downloads", label: "Downloads", icon: Folder },
    { id: "pictures", label: "Pictures", icon: Image },
  ];
  return (
    <div className="os-files simple">
      <aside className="os-sidebar">
        {locations.map((loc) => (
          <button className={view === loc.id ? "active" : ""} key={loc.id} onClick={() => setView(loc.id)}>
            <loc.icon size={15} />
            {loc.label}
          </button>
        ))}
      </aside>
      <div className="os-filegrid">
        <div className="os-pathbar">
          <Folder size={13} />
          <span>Files — /home/ahmed/{view === "home" ? "" : view + "/"}</span>
        </div>
        <div className="os-project-grid">
          {activeFolder.map((f) => (
            <button className="os-project" key={f} onDoubleClick={() => {
              const lower = f.toLowerCase();
              if (folders[lower]) setView(lower);
            }}>
              {folders[Object.keys(folders).find((k) => folders[k].includes(f))] ? <Folder size={26} /> : <FileText size={26} color="var(--text-icon)" />}
              <span>{f}</span>
              <small>{folders[Object.keys(folders).find((k) => folders[k].includes(f))] ? "folder" : "document"}</small>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export { CONTACT };
