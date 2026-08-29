import { useEffect, useRef, useState } from "react";
import { PROJECTS, CONTACT, projects, contact, terminalConfig, resumeMarkdown, nautilusFiles } from "../data";

const SRC = projects.length ? projects : PROJECTS;

const helpText = [
  "Available commands:",
  "  help            show this help",
  "  ls              list home directory (/home/ahmed)",
  "  pwd             print working directory",
  "  whoami          current user",
  "  neofetch        system information",
  "  date            current date and time",
  "  echo <text>     print text",
  "  cat <file>      show a file (projects, resume, about)",
  "  cd <dir>        change directory (pretend)",
  "  projects        list all 10 projects",
  "  stack           show full tech stack",
  "  open <app>      open an application",
  "  clear           clear the terminal",
  "  banner          show banner",
  "  github          open GitHub",
  "  hello           greeting",
];

function neofetch() {
  const logo = `
           .--.
          |o_o |
          |:_/ |
         //   \\ \\     Ahmed Irfan Akrami
        (|     | )    ------------------------
       /'\\_   _/\`\\    User: ahmed@mintex
       \\___)=(___/    OS: Mintex Linux
                      Shell: bash 5.2
                      Terminal: Mintex Terminal
                      Project: AHMED-OS Linux Portfolio
                      Uptime: 24/7 recruiter ready`;
  return logo.trim();
}

export default function Terminal({ onOpenApp }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState([
    "Mintex Linux shell v1.0",
    "Type `help` for a list of commands.",
    "",
  ]);
  const boxRef = useRef(null);

  useEffect(() => {
    const box = boxRef.current;
    if (box) box.scrollTop = box.scrollHeight;
  }, [lines]);

  function runCommand() {
    const raw = input.trim();
    const command = raw.toLowerCase();
    let output = "";

    if (!raw) {
      setInput("");
      return;
    }

    if (command === "clear") {
      setLines([]);
      setInput("");
      return;
    }

    if (command === "help") output = helpText.join("\n");
    else if (command === "ls") output = `ahmed/\n  Projects/  (${SRC.length} projects)\n  Resume/    resume.md\n  Documents/ ${(nautilusFiles.documents[0] || "Resume.pdf")}\n  Downloads/ ${(nautilusFiles.downloads[0] || "CrocOS_Firmware.zip")}\n  Pictures/  ${(nautilusFiles.pictures[0] || "edgebot_build.jpg")}\n  Music/\n  Videos/`;
    else if (command === "pwd") output = "/home/ahmed";
    else if (command === "whoami") output = terminalConfig.whoami || "ahmed (Ahmed Irfan Akrami)";
    else if (command === "neofetch") output = neofetch();
    else if (command === "date") output = new Date().toString();
    else if (command === "banner") output = "Welcome to Mintex Linux — where robotics meets the desktop.";
    else if (command === "github") { window.open(contact.github || "https://github.com/xCYBERx01", "_blank"); output = `Opening ${contact.github || "github.com/xCYBERx01"}`; }
    else if (command === "hello") output = "Hello! Thanks for exploring my Linux portfolio.";
    else if (command === "projects") output = SRC.map((p) => `${p.path.padEnd(38)} ${p.group}`).join("\n");
    else if (command === "stack") output = SRC.map((p) => `${p.name}: ${p.details}`).join("\n\n");
    else if (command === "contact") output = `mail: ${contact.email}\nweb: ${contact.github}\nloc: ${contact.location || "Karnataka, India"}`;
    else if (command === "cat resume") output = resumeMarkdown.trim();
    else if (command === "cat projects") output = SRC.map((p) => `- ${p.name} [${p.group}]`).join("\n");
    else if (command === "cat about") output = terminalConfig.whoami || "Robotics, embedded systems, electronics, software, and research presented as a lightweight Linux desktop.";
    else if (command === "cd" || command === "cd ~") output = "/home/ahmed";
    else if (command === "cd ..") output = "/home";
    else if (command === "open" || command === "open home") output = "usage: open <app>  apps: nautilus, firefox, terminal, contact, dashboard, notes, paint, media, taskmanager, settings, calendar, store, recycle, about";
    else if (command.startsWith("open ")) {
      const appName = command.slice(5).trim();
      const known = {
        nautilus: "nautilus",
        files: "nautilus",
        projects: "nautilus",
        resume: "nautilus",
        firefox: "firefox",
        browser: "firefox",
        ie: "firefox",
        terminal: "terminal",
        contact: "contact",
        msn: "contact",
        dashboard: "dashboard",
        notes: "notes",
        notepad: "notes",
        settings: "settings",
        taskmanager: "taskmanager",
        task: "taskmanager",
        tasks: "taskmanager",
        sysmon: "taskmanager",
        about: "about",
        home: "about",
        paint: "paint",
        media: "media",
        calendar: "calendar",
        store: "store",
        recycle: "recycle",
        trash: "recycle",
        crypto: "dashboard",
        news: "dashboard",
        fortune: "dashboard",
      };
      if (known[appName]) {
        onOpenApp(known[appName]);
        output = `Opening ${appName}...`;
      } else {
        output = `open: ${appName}: no such application`;
      }
    } else if (command.startsWith("echo ")) {
      output = raw.slice(5);
    } else if (command.startsWith("cat ")) {
      output = `cat: ${command.slice(4)}: No such file or directory`;
    } else if (command.startsWith("cd ")) {
      output = `cd: ${command.slice(3)}: No such directory`;
    } else {
      output = `bash: ${command}: command not found — try \`help\``;
    }

    setLines((cur) => [...cur, `ahmed@mintex:~$ ${raw}`, output, ""]);
    setInput("");
  }

  return (
    <div className="os-terminal" ref={boxRef} onClick={(e) => e.currentTarget.querySelector("input")?.focus()}>
      {lines.map((line, i) => (
        <pre key={i}>{line || " "}</pre>
      ))}
      <div className="os-terminal-input">
        <span className="prompt">ahmed@mintex:~$</span>
        <input
          autoFocus
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && runCommand()}
          spellCheck={false}
          autoComplete="off"
        />
      </div>
    </div>
  );
}
