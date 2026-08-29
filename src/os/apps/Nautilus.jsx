import { useState } from "react";
import {
  Home,
  Folder,
  FolderOpen,
  FileText,
  Cpu,
  Search,
  ExternalLink,
  Trophy,
  Activity,
  Wrench,
  Monitor,
  Download,
  Image,
  Music,
  Video,
  ChevronRight,
  ChevronDown,
  Bot,
  Leaf,
  Wallet,
  PawPrint,
  Plane,
  Truck,
  Radio,
  BarChart3,
  PackageSearch,
  Droplets,
  Sun,
  Award,
  Code2,
  HardDrive,
  Globe,
} from "lucide-react";
import { projects, nautilusFiles, resumeMarkdown, awards, contact } from "../data";

const groupIcons = {
  Embedded: Cpu,
  Robotics: Trophy,
  Automation: Wrench,
  Software: Monitor,
  AI: Activity,
};

const projectIcons = {
  "proj-01": Cpu, // Croc OS — ESP32
  "proj-02": Monitor, // AHMED-OS — desktop OS
  "proj-03": Leaf, // Meadow — ecosystem
  "proj-04": Wallet, // Kharcha — expense
  "proj-05": Trophy, // Sports Engine — tournament
  "proj-06": PawPrint, // Wildlife — paw
  "proj-07": Bot, // EdgeBot — robot
  "proj-08": Droplets, // Field Shutter — rainwater
  "proj-09": Plane, // Drone — flight
  "proj-10": Truck, // Moon Rover — rover
  "proj-11": Radio, // IoT Telemetry — radio control
  "proj-12": BarChart3, // Field Analyzer — analytics
  "proj-13": PackageSearch, // ProjectDirec — parts directory
  "bonus-01": Activity,
  "bonus-02": Sun,
};

const HARDWARE_GROUPS = ["Embedded", "Robotics", "Automation"];
const SOFTWARE_GROUPS = ["Software", "AI"];

const FOLDER_TREE = [
  {
    id: "home",
    label: "ahmed",
    icon: Home,
    children: [
      {
        id: "projects",
        label: "Projects",
        icon: Folder,
        children: [
          {
            id: "projects-hardware",
            label: "hardware",
            icon: HardDrive,
            children: projects.filter((p) => HARDWARE_GROUPS.includes(p.group)).map((p) => ({
              id: `project-${p.id}`,
              label: p.name,
              icon: projectIcons[p.id] || groupIcons[p.group] || Folder,
              data: p,
            })),
          },
          {
            id: "projects-software",
            label: "software",
            icon: Code2,
            children: projects.filter((p) => SOFTWARE_GROUPS.includes(p.group)).map((p) => ({
              id: `project-${p.id}`,
              label: p.name,
              icon: projectIcons[p.id] || groupIcons[p.group] || Folder,
              data: p,
            })),
          },
        ],
      },
      {
        id: "awards",
        label: "Awards",
        icon: Award,
        children: awards.map((a) => ({
          id: `award-${a.id}`,
          label: a.name,
          icon: Trophy,
          data: { ...a, type: "award" },
        })),
      },
      {
        id: "resume",
        label: "Resume",
        icon: FileText,
        // matches Yute: Resume window shows 4 objects — ResumeFile, Github, WebResume, AhmedCLI
        children: [
          { id: "resume-file", label: "ResumeFile", icon: FileText, data: { type: "resume" } },
          { id: "resume-github", label: "Github", icon: Globe, data: { type: "link", url: `https://github.com/${contact.github.replace("https://github.com/", "").replace("github.com/", "")}` || "https://github.com/xCYBERx01", label: "Github" } },
          { id: "resume-web", label: "WebResume", icon: Globe, data: { type: "link", url: contact.website || "https://webcv-ahmed.netlify.app", label: "WebResume" } },
          { id: "resume-cli", label: "AhmedCLI", icon: Globe, data: { type: "link", url: contact.cli || "https://ahmedcli.netlify.app", label: "AhmedCLI" } },
        ],
      },
      {
        id: "documents",
        label: "Documents",
        icon: FileText,
        children: (nautilusFiles.documents || []).map((f, i) => ({
          id: `doc-${i}`,
          label: f,
          icon: FileText,
        })),
      },
      {
        id: "downloads",
        label: "Downloads",
        icon: Download,
        children: (nautilusFiles.downloads || []).map((f, i) => ({
          id: `dl-${i}`,
          label: f,
          icon: FileText,
        })),
      },
      {
        id: "pictures",
        label: "Pictures",
        icon: Image,
        children: (nautilusFiles.pictures || []).map((f, i) => ({
          id: `pic-${i}`,
          label: f,
          icon: Image,
        })),
      },
      { id: "music", label: "Music", icon: Music, children: [] },
      { id: "videos", label: "Videos", icon: Video, children: [] },
    ],
  },
];

function TreeItem({ item, selectedId, onSelect, depth = 0 }) {
  const [expanded, setExpanded] = useState(item.id === "home");
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;
  const isSelected = selectedId === item.id;

  return (
    <div>
      <button
        className={`nautilus-tree-item ${isSelected ? "selected" : ""}`}
        style={{ paddingLeft: `${12 + depth * 16}px` }}
        onClick={() => {
          onSelect(item.id);
          if (hasChildren) setExpanded(!expanded);
        }}
      >
        {hasChildren ? (
          expanded ? (
            <ChevronDown size={12} />
          ) : (
            <ChevronRight size={12} />
          )
        ) : (
          <span style={{ width: 12 }} />
        )}
        <Icon size={14} />
        <span>{item.label}</span>
      </button>
      {expanded && hasChildren && (
        <div>
          {item.children.map((child) => (
            <TreeItem
              key={child.id}
              item={child}
              selectedId={selectedId}
              onSelect={onSelect}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function findItem(items, id) {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItem(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

function getBreadcrumbs(items, id, path = []) {
  for (const item of items) {
    if (item.id === id) return [...path, item.label];
    if (item.children) {
      const found = getBreadcrumbs(item.children, id, [...path, item.label]);
      if (found) return found;
    }
  }
  return null;
}

function ProjectDetail({ project }) {
  const Icon = projectIcons[project.id] || groupIcons[project.group] || Folder;
  return (
    <div className="nautilus-detail">
      <div className="nautilus-detail-header">
        <Icon size={32} />
        <div>
          <h2>{project.name}</h2>
          <span className="nautilus-detail-path">{project.path}</span>
        </div>
      </div>
      <p>{project.summary}</p>
      {project.description && <p style={{ marginTop: 8, color: "#aaa", lineHeight: 1.6 }}>{project.description}</p>}
      <dl>
        <dt>Stack</dt>
        <dd>{project.details}</dd>
        <dt>Category</dt>
        <dd>{project.group}</dd>
      </dl>
      <a className="nautilus-link" href={project.github || "https://github.com/xCYBERx01"} target="_blank" rel="noreferrer">
        <ExternalLink size={14} />
        View on GitHub
      </a>
      {project.live && project.live !== "#" && (
        <a className="nautilus-link" href={project.live} target="_blank" rel="noreferrer" style={{ marginLeft: 8, background: "#2d2d2d", border: "1px solid #444" }}>
          <ExternalLink size={14} />
          Live Demo
        </a>
      )}
    </div>
  );
}

function AwardDetail({ award }) {
  return (
    <div className="nautilus-detail">
      <div className="nautilus-detail-header">
        <Award size={32} />
        <div>
          <h2>{award.name}</h2>
          <span className="nautilus-detail-path">~/awards/{award.id}</span>
        </div>
      </div>
      <p><strong>{award.org}</strong>{award.year ? ` — ${award.year}` : ""}</p>
      <p style={{ marginTop: 8, color: "#aaa", lineHeight: 1.6 }}>{award.desc}</p>
    </div>
  );
}

function ResumeDetail() {
  return (
    <div className="nautilus-detail" style={{ alignItems: "center" }}>
      <div className="nautilus-detail-header">
        <FileText size={32} />
        <div>
          <h2>ResumeFile</h2>
          <span className="nautilus-detail-path">~/resume/ResumeFile — resume.md + RESUME.PNG</span>
        </div>
      </div>
      <div style={{ width: "100%", border: "1px solid #333", borderRadius: 8, overflow: "hidden", background: "#fff", padding: 6, marginTop: 12 }}>
        <img src="/resume.png" alt="RESUME.PNG" style={{ maxWidth: "100%", display: "block" }} onError={(e) => { e.currentTarget.style.display = "none"; e.currentTarget.nextElementSibling.style.display = "block"; }} />
        <div style={{ display: "none", padding: 20, color: "#333", textAlign: "center", fontSize: 13 }}>PNG not found — check public/resume.png</div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <a href="/resume.png" target="_blank" rel="noreferrer" className="nautilus-link"><ExternalLink size={14} /> Open RESUME.PNG</a>
        <a href="/resume.png" download="RESUME.PNG" className="nautilus-link" style={{ background: "#2d2d2d", border: "1px solid #444" }}><ExternalLink size={14} /> Download PNG</a>
      </div>
      <pre style={{ whiteSpace: "pre-wrap", fontFamily: "var(--font-mono)", fontSize: 11, color: "#aaa", lineHeight: 1.6, marginTop: 14, borderTop: "1px solid #333", paddingTop: 10 }}>{resumeMarkdown.trim()}</pre>
    </div>
  );
}

export default function Nautilus() {
  const [selectedId, setSelectedId] = useState("home");
  const selectedItem = findItem(FOLDER_TREE, selectedId);
  const breadcrumbs = getBreadcrumbs(FOLDER_TREE, selectedId) || ["ahmed"];
  const children = selectedItem?.children || [];

  // footer like Yute: "3 object(s) | 2143 KB"
  const isResumeFolder = selectedId === "resume";

  return (
    <div className="nautilus">
      <aside className="nautilus-sidebar">
        <div className="nautilus-sidebar-header">
          <FolderOpen size={16} />
          <span>Files</span>
        </div>
        <div className="nautilus-tree">
          {FOLDER_TREE.map((item) => (
            <TreeItem
              key={item.id}
              item={item}
              selectedId={selectedId}
              onSelect={setSelectedId}
            />
          ))}
        </div>
      </aside>
      <main className="nautilus-main" style={{ display: "flex", flexDirection: "column" }}>
        <div className="nautilus-pathbar">
          <Search size={13} />
          {breadcrumbs.map((crumb, i) => (
            <span key={i}>
              {i > 0 && <ChevronRight size={12} className="nautilus-breadcrumb-sep" />}
              {crumb}
            </span>
          ))}
        </div>
        {/* Yute-style File Edit View Help bar when in Resume */}
        {isResumeFolder && (
          <div style={{ display: "flex", gap: 12, padding: "4px 10px", background: "#2d2d2d", borderBottom: "1px solid #333", fontSize: 12, color: "#aaa" }}>
            <span>File</span><span>Edit</span><span>View</span><span>Help</span>
          </div>
        )}
        {selectedItem?.data?.type === "resume" ? (
          <ResumeDetail />
        ) : selectedItem?.data?.type === "link" ? (
          <div className="nautilus-detail" style={{ alignItems: "center", textAlign: "center" }}>
            <Globe size={32} color="#4fc3f7" />
            <h2>{selectedItem.label}</h2>
            <p style={{ color: "#888" }}>{selectedItem.data.url}</p>
            <a href={selectedItem.data.url} target="_blank" rel="noreferrer" className="nautilus-link">
              <ExternalLink size={14} /> Open {selectedItem.label}
            </a>
            <div style={{ marginTop: 8, fontSize: 11, color: "#666" }}>Click the icon in the Resume folder also works.</div>
          </div>
        ) : selectedItem?.data?.type === "award" ? (
          <AwardDetail award={selectedItem.data} />
        ) : selectedItem?.data ? (
          <ProjectDetail project={selectedItem.data} />
        ) : children.length > 0 ? (
          <>
            <div className="nautilus-grid" style={{ flex: 1 }}>
              {children.map((child) => {
                const Icon = child.icon;
                const isLink = child.data?.type === "link";
                return (
                  <button
                    key={child.id}
                    className="nautilus-grid-item"
                    onClick={() => {
                      if (isLink && child.data.url) window.open(child.data.url, "_blank", "noopener,noreferrer");
                      else setSelectedId(child.id);
                    }}
                    title={isLink ? `Open ${child.data.url}` : child.label}
                  >
                    <Icon size={28} />
                    <span>{child.label}</span>
                  </button>
                );
              })}
            </div>
            {isResumeFolder && (
              <div style={{ display: "flex", borderTop: "1px solid #333", fontSize: 11, color: "#888", background: "#1a1a1a" }}>
                <span style={{ flex: 1, padding: "4px 8px", borderRight: "1px solid #333" }}>{children.length} object(s)</span>
                <span style={{ padding: "4px 8px" }}>2871 KB</span>
              </div>
            )}
          </>
        ) : (
          <div className="nautilus-empty">
            <Folder size={40} />
            <p>Folder is empty</p>
          </div>
        )}
      </main>
    </div>
  );
}
