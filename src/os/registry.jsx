import {
  Home,
  Folder,
  TerminalSquare,
  NotebookPen,
  Brush,
  Music,
  Gauge,
  Settings,
  Trash2,
  Calendar,
  LayoutGrid,
  Globe,
  Mail,
  Download,
} from "lucide-react";
import { AboutWindow, NotepadWindow, SettingsWindow, CalendarWindow } from "./apps/Content";
import Nautilus from "./apps/Nautilus";
import Terminal from "./apps/Terminal";
import { PaintWindow } from "./apps/Games";
import { TaskManagerWindow, SysMonitorWindow, RecycleBinWindow } from "./apps/System";
import { MediaPlayerWindow } from "./apps/Media";
import { AppStore } from "./components/AppStore";
import Firefox from "./apps/Firefox";
import Contact from "./apps/Contact";
import Dashboard from "./apps/Dashboard";

export function appRenderer(appId, props) {
  switch (appId) {
    case "about":
      return <AboutWindow {...props} />;
    case "nautilus":
      return <Nautilus />;
    case "terminal":
      return <Terminal {...props} />;
    case "notes":
      return <NotepadWindow />;
    case "paint":
      return <PaintWindow />;
    case "media":
      return <MediaPlayerWindow />;
    case "taskmanager":
      return <TaskManagerWindow {...props} />;
    case "sysmon":
      return <SysMonitorWindow />;
    case "recycle":
      return <RecycleBinWindow />;
    case "firefox":
      return <Firefox />;
    case "settings":
      return <SettingsWindow {...props} />;
    case "contact":
      return <Contact />;
    case "store":
      return <AppStore />;
    case "calendar":
      return <CalendarWindow />;
    case "dashboard":
      return <Dashboard onClose={() => props.onClose?.()} />;
    default:
      return <AboutWindow {...props} />;
  }
}

export function desktopApps() {
  return [
    { appId: "about", label: "Home", icon: Home },
    { appId: "nautilus", label: "Files", icon: Folder },
    { appId: "firefox", label: "Firefox", icon: Globe },
    { appId: "terminal", label: "Terminal", icon: TerminalSquare },
    { appId: "notes", label: "Notes", icon: NotebookPen },
    { appId: "paint", label: "Paint", icon: Brush },
    { appId: "media", label: "Media Player", icon: Music },
    { appId: "taskmanager", label: "Task Manager", icon: Gauge },
    { appId: "settings", label: "Settings", icon: Settings },
    { appId: "contact", label: "Contact", icon: Mail },
    { appId: "store", label: "App Store", icon: Download },
    { appId: "recycle", label: "Trash", icon: Trash2 },
    { appId: "calendar", label: "Calendar", icon: Calendar },
    { appId: "dashboard", label: "Dashboard", icon: LayoutGrid },
  ];
}

const TITLES = {
  about: "Home",
  nautilus: "Files — /home/ahmed",
  terminal: "Terminal",
  notes: "Notes — untitled.txt",
  paint: "Paint — untitled",
  media: "Media Player",
  taskmanager: "Task Manager",
  sysmon: "System Monitor",
  recycle: "Trash",
  firefox: "Firefox",
  settings: "Settings",
  contact: "Contact",
  store: "App Store",
  calendar: "Calendar",
  dashboard: "Dashboard",
};

export function appTitle(appId, label) {
  return TITLES[appId] || label || "Application";
}
